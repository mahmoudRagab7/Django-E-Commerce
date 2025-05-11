from django.urls import include, path

urlpatterns = [
    path("users/", include("base.urls.user_urls")),
    path("products/", include("base.urls.product_urls")),
    path("orders/", include("base.urls.order_urls")),
]
