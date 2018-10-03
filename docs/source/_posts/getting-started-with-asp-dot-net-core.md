---
title: Getting Started with ASP.NET Core
categories:
- [Getting Started]
---

This article describes how you can get started with CrystalQuartz Panel
plugged into .NET Core/Standard Core application.

<!--more-->

## Pre-requirements ##

It is assumed that you already have ASP.NET Core application up and running.
It could be web or self-hosted app, the only thing that is required is having 
an instance of `Microsoft.AspNetCore.Builder.IApplicationBuilder` object 
available. For web applications it is in `Startup.cs` file. 

## 1 Setup ##

As a first step, you need to install
[CrystalQuartz.AspNetCore](http://nuget.org/List/Packages/CrystalQuartz.AspNetCore)
NuGet package to the target project:

```bash
Install-Package CrystalQuartz.AspNetCore
```

That will add a `CrystalQuartz.AspNetCore.dll` reference to your project.
The `CrystalQuartz.AspNetCore.dll` is a single dll that contains all the
resources needed for CrystalQuartz to work.

## 2 Configuration ##

As a next step, you need to hook CrystalQuartz middleware into your 
ASP.NET Core environment. It should be done by calling `UseCrystalQuartz` 
extension method at the moment of pipeline initialization (as was mentioned,
for web apps it is in `Startup.cs` file). The generic syntax for panel 
configuration looks like this:

```cs
using CrystalQuartz.AspNetCore;
// ...
/*
 * app is IApplicationBuilder
 * scheduler is your IScheduler (local or remote)
 */
app.UseCrystalQuartz(() => scheduler);
```

The arguments are:

* `schedulerOrProvider` is a provider pointing to the scheduler instance;
* `options` is an optional for panel customization.

### 2.1 Configuration - Scheduler

This section describes different ways of passing `schedulerProvider` argument
to the `UseCrystalQuartz` method. You need to pick one of these options.

#### 2.1.1 Scheduler provider

If you already have the `IScheduler` object instance then you can pass it
a `Func` pointing to it to the configuration extension method:

```cs
IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();

// define the job and tie it to our HelloJob class
IJobDetail job = JobBuilder.Create<HelloJob>()
    .WithIdentity("job1", "group1")
    .Build();

// Trigger the job to run now, and then repeat every 10 seconds
ITrigger trigger = TriggerBuilder.Create()
    .WithIdentity("trigger1", "group1")
    .StartNow()
    .WithSimpleSchedule(x => x
    .WithIntervalInSeconds(10)
    .RepeatForever())
    .Build();

// Tell quartz to schedule the job using our trigger
scheduler.ScheduleJob(job, trigger);

scheduler.Start();

/*
 * Init CrystalQuartz Panel with scheduler instance.
 */
app.UseCrystalQuartz(() => scheduler);
```

You can get it from an IoC container:

```cs
/* ... */
app.UseCrystalQuartz(() => container.Resolve<IScheduler>());
```
### 2.2 Options

Second (optional) argument of `UseCrystalQuartz` method allows to do some panel customizations. The object should be an instance of `CrystalQuartzOptions` class:

```cs
public class CrystalQuartzOptions
{
    public string Path { get; set; }

    public string CustomCssUrl { get; set; }
}
```

Usage could be like this:

```cs
app.UseCrystalQuartz(
    () => scheduler,
    new CrystalQuartzOptions
    {
        CustomCssUrl = "...",
        Path = "..."
    });
```

* `Path` is a url component for the panel. Default is `/quartz`
* `CustomCssUrl` - a valid url (absolute or relative) to load additional css styles to the panel.

## 3 Running the panel ##

Once the configuration is done, you can run your project and navigate to `http://YOUR_URL/quartz` to see the panel UI. 

## 4 Examples ##

- [OWIN ASP.NET Core Web App](//github.com/guryanovev/CrystalQuartz/tree/master/examples/09_Quartz3_AspNetCore_Web)
