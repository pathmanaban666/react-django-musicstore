from rest_framework import status
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.views import APIView


class ProductView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductRetrieve(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CartListCreateView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CartDetailView(generics.GenericAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            raise NotFound("Cart not found.")

        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemCreateView(generics.CreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()


class CartItemDeleteView(generics.DestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        cart_items = data.get("cart_items", [])
        shipping_data = data.get("shipping_details", {})
        payment_method = data.get("payment_method", "card")

        if not cart_items:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Total Calculation
        total_price = 0
        for item in cart_items:
            product_id = item["product"]["id"]
            product = Product.objects.get(id=product_id)
            total_price += product.price * item["quantity"]

        # Order Creation
        order = Order.objects.create(
            user=user,
            total_price=total_price,
            payment_method=payment_method,
            is_paid=True  
        )

        for item in cart_items:
            product_id = item["product"]["id"]
            product = Product.objects.get(id=product_id)
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                price=product.price
            )

        ShippingAddress.objects.create(
            order=order,
            full_name=shipping_data.get("fullName", ""),
            address=shipping_data.get("address", ""),
            city=shipping_data.get("city", ""),
            state=shipping_data.get("state", ""),
            postal_code=shipping_data.get("postalCode", ""),
            country=shipping_data.get("country", ""),
            phone=shipping_data.get("phone", "")
        )

        if request.user.is_authenticated:
            try:
                cart = Cart.objects.get(user=request.user)
                cart.items.all().delete()
            except Cart.DoesNotExist:
                pass

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
