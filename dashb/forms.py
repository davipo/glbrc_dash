from django import forms


class AppSelectForm(forms.Form):
    app_positions = forms.CharField()


