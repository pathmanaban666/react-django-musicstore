from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminCategoryViewSet, AdminProductViewSet, AdminUserViewSet, AdminOrderViewSet, AdminLoginView

router = DefaultRouter()
router.register(r'admin/categories', AdminCategoryViewSet)
router.register(r'admin/products', AdminProductViewSet)
router.register(r'admin/users', AdminUserViewSet)
router.register(r'admin/orders', AdminOrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
]