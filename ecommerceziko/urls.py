from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from base.views import template_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("base.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", template_views.index, name="index"),
    path("register/", template_views.register, name="register"),
    path("login/", template_views.login, name="login"),
    path("products/", template_views.products, name="products"),
    path("product/<str:pk>/", template_views.product_detail, name="product_detail"),
    path("cart/", template_views.cart, name="cart"),
    path("profile/", template_views.profile, name="profile"),
    path("orders/", template_views.orders, name="orders"),
]

# Add this block to serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)