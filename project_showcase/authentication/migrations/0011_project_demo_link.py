# Generated by Django 4.2.7 on 2025-02-07 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0010_student_interested_technologies'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='demo_link',
            field=models.URLField(blank=True, null=True),
        ),
    ]
