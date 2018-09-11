from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from . import models
from . import forms


def default_applist():
    """List of app names for default grid.
        Include only apps whose default_status is True;
        put them in default positions by AppInfo order.
        Use empty string for positions with no app.
    """
    apps = models.AppInfo.objects.all()
    appnames = [(app.name if app.default_status else '') for app in apps]
    appnames += ['' for _ in range(models.GRID_SIZE - len(appnames))]
    return appnames


def apps_for_names(appnames):
    """Given list of app names, return list of corresponding app objects.
        (Use None for empty name)
    """
    return [(models.AppInfo.objects.get(name=name) if name else None)
            for name in appnames]


@login_required
def dashboard(request):
    try:
        dashuser = models.DashUser.objects.get(user=request.user)
    except models.DashUser.DoesNotExist:
        # add new DashUser, with default apps
        appgrid = ','.join(default_applist())
        dashuser = models.DashUser.objects.create(
            user=request.user, appgrid=appgrid)
    
    if request.method == 'POST':
        form = forms.AppSelectForm(request.POST)
        if form.is_valid():
            if 'submitsave' in request.POST:
                dashuser.appgrid = form.cleaned_data['app_positions']
                dashuser.save()
    
    appnames = dashuser.appgrid.split(',')    # list of app names in grid
    apps_checked = [(app, app.name in appnames)
                    for app in models.AppInfo.objects.all()]
    context = {
        'grid_apps': apps_for_names(appnames),
        'apps_checked': apps_checked,
    }
    return render(request, 'dashb/dash.html', context)

