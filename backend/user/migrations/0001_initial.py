# Generated by Django 3.0.6 on 2020-06-01 08:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DeliveryAddress',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=64)),
                ('last_name', models.CharField(max_length=64)),
                ('type', models.CharField(choices=[('both', 'Both'), ('billing', 'Billing'), ('shipping', 'Shipping')], default='shipping', help_text='the type can be: both, billing or shipping', max_length=20)),
                ('street', models.CharField(max_length=64)),
                ('str_nr', models.IntegerField(verbose_name='street number')),
                ('apt_nr', models.IntegerField(verbose_name='apartment number')),
                ('zip', models.IntegerField()),
                ('city', models.CharField(max_length=64)),
                ('country', models.CharField(max_length=64)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'delivery_address',
            },
        ),
    ]