# Generated by Django 4.2.7 on 2025-03-03 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0013_project_department_project_year'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='projects_completed',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='student',
            name='projects_involved',
            field=models.ManyToManyField(blank=True, to='authentication.project'),
        ),
        migrations.AddField(
            model_name='student',
            name='resume',
            field=models.FileField(blank=True, null=True, upload_to='resumes/'),
        ),
        migrations.AddField(
            model_name='student',
            name='skills',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
