from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    currentPassword = serializers.CharField(write_only=True, required=False)
    newPassword = serializers.CharField(write_only=True, required=False)
    profilePicture = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'firstName',
            'lastName',
            'isEmailVerified',
            'isTwoFactorEnabled',
            'profilePicture',
            'currentPassword',
            'newPassword',
        ]
        read_only_fields = ['id', 'isEmailVerified']

    def validate(self, data):
        if 'newPassword' in data and not data.get('currentPassword'):
            raise serializers.ValidationError('Current password is required to change password')
        return data

    def update(self, instance, validated_data):
        current_password = validated_data.pop('currentPassword', None)
        new_password = validated_data.pop('newPassword', None)
        profile_picture = validated_data.pop('profilePicture', None)

        if new_password:
            if not instance.check_password(current_password):
                raise serializers.ValidationError('Current password is incorrect')
            instance.set_password(new_password)

        if profile_picture:
            instance.profilePicture = profile_picture

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance 