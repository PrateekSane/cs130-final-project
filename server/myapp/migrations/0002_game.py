# Generated by Django 4.1.12 on 2023-10-28 04:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myapp", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Game",
            fields=[
                ("game_id", models.AutoField(primary_key=True, serialize=False)),
                ("start_time", models.DateTimeField()),
                ("end_time", models.DateTimeField(blank=True, null=True)),
                ("starting_balance", models.FloatField()),
            ],
        ),
    ]
