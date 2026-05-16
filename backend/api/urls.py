from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, AttendanceViewSet
from .views import AdminOnlyView
from .views import EventListCreateView, EventDetailView
from .views import CurrentUserView

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'attendance', AttendanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin-only/', AdminOnlyView.as_view()),
    path('events/', EventListCreateView.as_view()),
    path('events/<int:pk>/', EventDetailView.as_view()),
    path('me/', CurrentUserView.as_view()),
]