---
title: Detecting failed Quartz runs
categories:
- [Advanced Configuration]
---

CrystalQuartz panel can detect and highlight failed trigger runs. 
They display as red bars on the timeline:

![Failed runs on the timeline](/CrystalQuartz/images/detecting_errors_timeline.png)

<!-- more -->

*Trigger fire info* dialog (opens on timeline bar click) may show 
details for the failed run:

![Failed run details](/CrystalQuartz/images/detecting_errors_details.png)

## Automatic error detection

By default CrystalQuartz listens to unhandled job exceptions. 
So with zero-config you would be able to see red bars and minimal
error details for any unhandled job error.

```cs
public class FooJob : IJob
{
    public void Execute(IJobExecutionContext context)
    {
        // do something
        
        if (somethigWentWrong) 
        {
            /**
             * This exception will be handled by CrystalQuartz and
             * the run will be marked as failured.
             */
            throw new Exception("Something went wrong...");
        }
    }
}
```

## Manually providing error details

According to the Quartz.NET best practices, all the exceptions should
be handled in the job itself instead of passing them to the scheduler. So
if you wrap your job code with `try/catch` block then you need to manually 
inform CrystalQuartz if there are any errors by setting `conext.Result`. 

**By default, CrystalQuartz expects job result to be a Dictionary 
containing some standard keys.**

If you just want to mark the run as failed, set `result["Failed"]=true` or 
`result["Success"]=false`.

```cs
public class FooJob : IJob
{
    public void Execute(IJobExecutionContext context)
    {
        context.Result = new Dictionary<string, object>
        {
            { "Failed", true }
        };
        
        // or, equivalent
        
        context.Result = new Dictionary<string, object>
        {
            { "Success", false }
        };
    }
}
```

If you also have an exception, pass it to the dictionary with `"Error"`
key:

```cs
public class FooJob : IJob
{
    public void Execute(IJobExecutionContext context)
    {
        try 
        {
            // do something
        }
        catch (Exception ex)
        {
            context.Result = new Dictionary<string, object>
            {
                { "Error", ex }
            };
        }
    }
}
```

## Error detection tuning

Error detection behavior can be customized by changing initial CrystalQuartz
options passed to `UseCrystalQuartz` method:

```cs
var options = new CrystalQuartzOptions
{
    // customizations go here
};
app.UseCrystalQuartz(schedulerProvider, options);
```

### Include inner exception

Default error detection verbosity level is `Minimal`, that means only top level 
exception message will be captured and stored. To include inner exceptions just 
set `VerbosityLevel` to `Detailed`:

```cs
var options = new CrystalQuartzOptions
{
    ErrorDetectionOptions = new ErrorDetectionOptions
    {
        VerbosityLevel = ErrorVerbosityLevel.Detailed
    }
};
```

### Exception message truncation

In `Minimal` verbosity level QrystalQuartz truncates long exception messages.
By default maximum length is 200 characters, set `ExceptionMessageLengthLimit` property if
you want to extend this limit.
 
```cs
var options = new CrystalQuartzOptions
{
    ErrorDetectionOptions = new ErrorDetectionOptions
    {
        ExceptionMessageLengthLimit = 500
    }
};
```

Please note that in `Detailed` verbosity mode the messages are not truncated.

### Disable error detection

Use this configuration if you want to completely disable the error detection
feature:

```cs
var options = new CrystalQuartzOptions
{
    ErrorDetectionOptions = new ErrorDetectionOptions
    {
        Source = ErrorExtractionSource.None,
        VerbosityLevel = ErrorVerbosityLevel.None
    }
};
```

This not only makes all the timeline bars green but also optimizes runtime
as the error detection services would not be created and attached to the 
scheduler.