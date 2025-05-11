from django.urls import path, include

urlpatterns = [
    path('products/', include('base.urls.product_urls')),
    path('users/', include('base.urls.user_urls')),
    path('orders/', include('base.urls.order_urls')),
]