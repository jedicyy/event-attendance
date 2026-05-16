from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from authsystem.permissions import IsAdminRole

from rest_framework import generics
from .models import Event, Attendance
from .serializers import EventSerializer, AttendanceSerializer


class EventViewSet(viewsets.ModelViewSet):

    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]


class AttendanceViewSet(viewsets.ModelViewSet):

    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

class AdminOnlyView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        return Response({
            "message": "Welcome Admin"
        })
    
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsAdminRole()]
        return [IsAuthenticated()]

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAuthenticated(), IsAdminRole()]
        return [IsAuthenticated()]
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "role": request.user.role,
        })