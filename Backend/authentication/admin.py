from django.contrib import admin

# Register your models here.

from .models import CompanyAuth, CustomUser, Student

class CompanyAuthAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'is_active']
    actions = ['make_active']

    def make_active(self, request, queryset):
        for company in queryset:
            # Set CompanyAuth is_active to True
            company.is_active = True
            company.save()

            # Set related CustomUser is_active to True
            user = company.user
            user.is_active = True
            user.save()

    make_active.short_description = "Set selected companies and related users as active"

class Student_is_active(admin.ModelAdmin):
    list_display = ['username', 'is_active']

    actions = ['set_active']
    
    def set_active(self, request, queryset):
        queryset.update(is_active=True)
    set_active.short_description = "Set selected students as active"  # Description for the action


admin.site.register(CustomUser, Student_is_active)
admin.site.register(CompanyAuth, CompanyAuthAdmin)
