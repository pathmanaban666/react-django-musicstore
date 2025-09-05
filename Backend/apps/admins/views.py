from rest_framework import status
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .serializers import AdminLoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..products.models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, UserSerializer, OrderSerializer, ShippingAddressSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action


class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff


class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser] 


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer

    @action(detail = True, methods = ["patch"])
    def update_status(self, request, pk = None):
        order = self.get_object()
        shipping = getattr(order, "shipping_address", None)

        if not shipping:
            return Response({"error": "No shipping address found"}, status = status.HTTP_404_NOT_FOUND)

        serializer = ShippingAddressSerializer(shipping, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username = username, password = password)

        if user and user.is_staff:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token)
            })
        return Response({"detail": "Invalid credentials or not admin"}, status = status.HTTP_401_UNAUTHORIZED)