---
title: Configuring Allowed Job Types
categories:
- [Advanced Configuration]
---

This article describes how to control what job types appear in the *Job Class* dropdown
when you use *Schedule Job Dialog*:

![Schedule Job Dialog](/images/schedule_new_job_dialog.png)

<!-- more -->

If you use *Schedule Job* functionality of CrystalQuartzPanel to add new jobs, you might
notice that it is not possible for a user to enter *any* job class, you should select it from a 
dropdown instead: 

![Schedule Job -> Job Class](/images/schedule_new_job_dialog_options.png)

It is so for security reasons to avoid possible runs of harmful jobs.

But you may run into a situation where the *Job Class* dropdown does not contain the job you
want to schedule. This situation is fairly common, because by default the dropdown contains only
the job classes that are already scheduled, so if you want to schedule something new, it is definitely
not in the list. And if your scheduler is empty yet, you will see the error. 

<p style="color: #cb4437;">Can not schedule a 
job as no allowed job types provided. Please make sure you configured allowed job types</p>

![Empty Scheduler Error](/images/schedule_new_job_dialog_no_options.png)

In any of these cases you need to provide CrystalQuartzPanel with the list of *Allowed Job Types*
by setting `AllowedJobTypes` property of `CrystalQuartzOptions` object.

For example, here is how we can enable standard Quartz 2 mail sending job:

```cs
app.UseCrystalQuartz(
    () => scheduler, 
    new CrystalQuartzOptions
    {
        AllowedJobTypes = new[]
        {
            typeof(SendMailJob)
            /* Place Job Types here */
        }
    });
```

Now the `SendMailJob` can be selected in the dropdown:

![Schedule New Job - SendMailJob](/images/schedule_new_job_dialog_sendmailjob.png)

If particular job types are not known, it is possible to do an "assembly scan".
Just to demonstrate this technique we can enable all Quartz 2 standard jobs:

```cs
app.UseCrystalQuartz(
    () => scheduler, 
    new CrystalQuartzOptions
    {
        // THIS CODE EXPOSES HARMFUL JOBS!!!
        // DO NOT DO IT IN PRODUCTION!
        AllowedJobTypes = Assembly
            .GetAssembly(typeof(IScheduler))
            .GetExportedTypes()
            .Where(x => 
                x.IsPublic && 
                x.IsClass && 
                !x.IsAbstract && 
                typeof(IJob).IsAssignableFrom(x))
            .ToArray()
    });
```

Now we can select standard Quartz 2 jobs:

![Schedule New Job - SendMailJob](/images/schedule_new_job_dialog_quartz2.png)
 
Please note that the list includes `Quartz.Job.NativeJob` that can run any command
on the application machine and is really dangerous in production, so please consider
the risks when you use this technique to expose job types.

