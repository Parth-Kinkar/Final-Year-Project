# Generated by Django 4.2.7 on 2025-02-06 04:09

import authentication.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0009_project_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='interested_technologies',
            field=models.CharField(blank=True, max_length=255, null=True, validators=[authentication.models.validate_technologies]),
        ),
    ]
