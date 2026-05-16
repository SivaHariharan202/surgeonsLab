from django.urls import path
from ..service.task import FindAllTaskService,CreateTaskService,GetAllTaskService,UpdateTaskStatusService,GetAssignedTaskService

urlpatterns = [

    # create task
   path('create-task/',CreateTaskService,name='create-task'),

    # get task
   path('get-tasks/', GetAllTaskService,name='get-tasks'),
    #update  task histroy
   path('update-task/<int:task_id>/', UpdateTaskStatusService,name='update-task'),

   path('my-tasks/',GetAssignedTaskService,name='my-tasks'),

   path("find-all/", FindAllTaskService,name="find-all" ),


]




