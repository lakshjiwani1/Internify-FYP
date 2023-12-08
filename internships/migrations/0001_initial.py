# Generated by Django 4.2.7 on 2023-12-02 16:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authentication', '0002_student_cv_file_student_profile_picture'),
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cv_file', models.FileField(upload_to='student_cvs/')),
            ],
        ),
        migrations.CreateModel(
            name='Internships',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('location', models.CharField(max_length=255)),
                ('required_skills', models.TextField()),
                ('qualifications', models.TextField()),
                ('application_deadline', models.DateField()),
                ('is_published', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('applied_students', models.ManyToManyField(through='internships.Application', to='authentication.student')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.companyauth')),
            ],
        ),
        migrations.AddField(
            model_name='application',
            name='internship',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='internships.internships'),
        ),
        migrations.AddField(
            model_name='application',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.student'),
        ),
    ]
