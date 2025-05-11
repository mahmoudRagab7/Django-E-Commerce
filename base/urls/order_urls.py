from django.urls import path

from base.views.order_views import (
    addOrderItems,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderToDelivered,
    updateOrderToPaid,
)

urlpatterns = [
    path("add/", addOrderItems, name="orders-add"),
    path("myorders/", getMyOrders, name="myorders"),
    path("<str:pk>/", getOrderById, name="order"),
    path("<str:pk>/pay/", updateOrderToPaid, name="pay-order"),
    path("<str:pk>/deliver/", updateOrderToDelivered, name="deliver-order"),
    path("", getAllOrders, name="all-orders"),
]
