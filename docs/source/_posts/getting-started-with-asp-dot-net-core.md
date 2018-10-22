---
title: Getting Started with ASP.NET Core
categories:
- [Getting Started]
---

This article describes how you can get started with CrystalQuartz Panel
plugged into ASP.NET Core application.

<!--more-->

## Pre-requirements ##

It is assumed that you already have ASP.NET Core application up and running.
You should have an instance of `Microsoft.AspNetCore.Builder.IApplicationBuilder` object 
available. For web applications it is usually in `Startup.cs` file. 

```cs
// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // ...

    // CrystalQuartz Panel will be initialized here
    
    // app.UseMvc and other calls go next
}
```

It is also assumed that you have [Quartz.NET v3 package](http://nuget.org/List/Packages/Quartz) installed and `IScheduler` instance
available.

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
extension method at the moment of pipeline initialization. The generic 
syntax for panel configuration looks like this:

```cs
using CrystalQuartz.AspNetCore;
// ...
/*
 * app is IApplicationBuilder
 * scheduler is your IScheduler (local or remote)
 */
app.UseCrystalQuartz(() => scheduler, options);
```

The arguments are:

* `() => scheduler` is a provider pointing to the scheduler instance;
* `options` is an optional for panel customization.

### 2.1 Configuration - Scheduler

You should already have an `IScheduler` object instance so you can pass 
a `Func` pointing to it to the configuration extension method:

```cs
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // ...

    IScheduler scheduler = CreateScheduler();
    app.UseCrystalQuartz(() => scheduler);

    // ...
}

// this method is just a sample of scheduler initialization
private IScheduler CreateScheduler()
{
    var schedulerFactory = new StdSchedulerFactory();
    var scheduler = schedulerFactory.GetScheduler().Result;

    // construct job info
    var jobDetail = JobBuilder.Create<HelloJob>()
        .WithIdentity("myJob")
        .StoreDurably()
        .Build();

    // fire every minute
    var trigger = TriggerBuilder.Create()
        .WithIdentity("myTrigger")
        .StartNow()
        .WithSimpleSchedule(x => x.WithIntervalInMinutes(1).RepeatForever())
        .Build();

    scheduler.ScheduleJob(jobDetail, trigger);

    scheduler.Start();

    return scheduler;
}
```

Or you can get `IScheduler` from an IoC container if you have one configured:

```cs
/* ... */
app.UseCrystalQuartz(() => container.Resolve<IScheduler>());
```

### 2.2 Options

Second (optional) argument of `UseCrystalQuartz` method allows to do some panel customizations. 
The object should be an instance of `CrystalQuartzOptions` class. Please check the [options class
source code](https://github.com/guryanovev/CrystalQuartz/blob/master/src/CrystalQuartz.Application/CrystalQuartzOptions.cs) for details.

## 3 Running the panel ##

Once the configuration is done, you can run your project and navigate to `http://YOUR_URL/quartz`
to see the panel UI. 

## 4 Examples ##

- [OWIN ASP.NET Core Web App](//github.com/guryanovev/CrystalQuartz/tree/master/examples/09_Quartz3_AspNetCore_Web)
