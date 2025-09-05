from django.urls import path
from .views import *

urlpatterns=[
    path('product/',ProductView.as_view()),
    path('product/<int:pk>/',ProductRetrieve.as_view()),
    path('cart/', CartListCreateView.as_view(), name='cart-list-create'),
    path('carts/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/items/', CartItemCreateView.as_view(), name='cartitem-create'),
    path('cart/items/<int:pk>/', CartItemDeleteView.as_view(), name='cartitem-delete'),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
]