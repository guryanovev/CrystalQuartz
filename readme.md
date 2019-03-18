![](http://guryanovev.github.io/CrystalQuartz/demo_v6.png)

Crystal Quartz Panel is a lightweight, completely pluggable module for displaying Quartz.NET scheduler jobs information.

[![Build Status](https://travis-ci.org/guryanovev/CrystalQuartz.svg?branch=master)](https://travis-ci.org/guryanovev/CrystalQuartz)
[![Join the chat at https://gitter.im/guryanovev/CrystalQuartz](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/guryanovev/CrystalQuartz?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## [View Demo](http://guryanovev.github.io/CrystalQuartz/demo/?v=6.9.0&utm_source=readme) (serverless, Quartz.NET scheduler is emulated in the browser) ##

# Features #

  * simple and lightweight, could be embedded into existing application:
    * supports OWIN-based web or standalone applications;
    * supports non-OWIN web applications;
    * native support for ASP.NET Core (without OWIN).
  * displays basic scheduler information:
    * scheduler state and properties;
    * triggers by jobs and groups;
    * job properties (`JobDataMap`);
  * ability to perform basic scheduler actions:
    * pause/resume/delete triggers, jobs or groups;
    * start/shutdown/standby/resume a scheduler;
    * execute a job on demand ("Trigger Now");
    * add a trigger for jobs;
  * easy integration with a *remote scheduler* (see [examples](https://github.com/guryanovev/CrystalQuartz/tree/master/examples));
  * works with Quartz.NET v2 or v3.

# Pre Requirements #

1. Quartz.NET v2 or v3 installed to project you want to use as a CrystalQuartz panel host. 
    <details>
      <p>CrystalQuartz detects Quartz.dll version at runtime and does not explicitly depend on Quartz 
      <a href="https://www.nuget.org/packages/Quartz/">NuGet</a> package. So you need to make sure
      you have Quartz pre-installed.</p>
      <p>For Quartz 3:</p>
      <pre>Install-Package Quartz -Version 3.0.2</pre>
      <p>For Quartz 2:</p>
      <pre>Install-Package Quartz -Version 2.6.1</pre>
    </details>
  
2. Make sure you have appropriate target framework version
    <details>
      <h3>Minimal supported .NET versions (vary by packages)</h3>
      For Quartz v2 + CrystalQuartz.Owin &rarr; .NET 4.5<br/>
      For Quartz v2 + CrystalQuartz.Simple &rarr; .NET 4.0<br/>
      For Quartz v2 + CrystalQuartz.Remote &rarr; .NET 4.0<br/>
      For Quartz v3 + CrystalQuartz.Owin &rarr; .NET 4.5.2<br/>
      For Quartz v3 + CrystalQuartz.Simple &rarr; .NET 4.5.2<br/>
      For Quartz v3 + CrystalQuartz.Remote &rarr; .NET 4.5.2<br/>
      For Quartz v3 + CrystalQuartz.AspNetCore &rarr; .NET Standard 2.0<br/>
    </details>

# Getting started #

CrystalQuartzPanel is an embeddable module that can be plugged into an existing application. Getting started strategy depends on a type of environment you use.

## Option 1: OWIN (recommended) ##

1. Install NuGet package

    ```Install-Package CrystalQuartz.Owin -IncludePrerelease```

2. Once you have an OWIN-supporting application (no matter if it's web or self hosted) you can activate CrystalQuartz panel:

    ```C#
    using CrystalQuartz.Owin;
    // ...
    /*
     * app is IAppBuilder
     * scheduler is your IScheduler (local or remote)
     */
    app.UseCrystalQuartz(() => scheduler);
    ```

3. Run your app and navigate to 

    ```localhost:YOUR_PORT/quartz```

Please check [complete OWIN setup guide](//github.com/guryanovev/CrystalQuartz/wiki/CrystalQuartz-OWIN-Configuration) for more details.
  
**Examples**
- [OWIN Self-hosted console app example](//github.com/guryanovev/CrystalQuartz/tree/master/examples/01_Owin_SelfHosted)
- [OWIN Simple site](//github.com/guryanovev/CrystalQuartz/tree/master/examples/02_Owin_Web_Simple)
- [OWIN Web site + remote](//github.com/guryanovev/CrystalQuartz/tree/master/examples/03_Owin_Web_Remote)
                                         
## Option 2: ASP.NET Core ##

1. Install NuGet package

    ```Install-Package CrystalQuartz.AspNetCore -IncludePrerelease```

2. Once you have an ASP.NET Core-supporting application (no matter if it's web or self hosted) you can activate CrystalQuartz panel:

    ```C#
    using CrystalQuartz.AspNetCore;
    // ...
    /*
     * app is IAppBuilder
     * scheduler is your IScheduler (local or remote)
     */
    app.UseCrystalQuartz(() => scheduler);
    ```

3. Run your app and navigate to 

    ```localhost:YOUR_PORT/quartz```

**Examples**
- [OWIN ASP.NET Core Web App](//github.com/guryanovev/CrystalQuartz/tree/master/examples/09_Quartz3_AspNetCore_Web)
    
## Option 3: Non-OWIN (Legacy ASP.NET) ##

Non-owin CrystalQuartzPanel implemented as an http module. It can work in web-applications only and requires some configuration to be added to the `web.config` file. There are two NuGet packages aimed to help in case of non-owin application, the choice depends on the type of scheduler you use.

**Option 2.1: If Quartz Scheduler works in the app domain of your web application:**

1. Install [CrystalQuartz.Simple](http://nuget.org/List/Packages/CrystalQuartz.Simple) NuGet package.

    ```Install-Package CrystalQuartz.Simple -IncludePrerelease```

2. Customize `SimpleSchedulerProvider` class that has been added by NuGet package
  
    ```C#
    public class SimpleSchedulerProvider : ISchedulerProvider
    {
        public object CreateScheduler(ISchedulerEngine engine)
        {
            ISchedulerFactory schedulerFactory = new StdSchedulerFactory();
            var scheduler = GetScheduler(schedulerFactory.GetScheduler());

            /* ADD JOBS HERE */
      
            return scheduler;
        }
        //...
    }
    ```
3. Run you application and go to `YOUR_APP_URL/CrystalQuartzPanel.axd`
 
**Option 2.2: If Quartz Scheduler works in a separate application (remote scheduler):**

1. Install [CrystalQuartz.Remote](http://nuget.org/List/Packages/CrystalQuartz.Remote) NuGet package.
  
    ```Install-Package CrystalQuartz.Remote -IncludePrerelease```
 
2. Customize url of the remote scheduler in web config file:
 
    ```XML
    <crystalQuartz>
        <provider>
            <add property="Type" 
                 value="CrystalQuartz.Core.SchedulerProviders.RemoteSchedulerProvider, CrystalQuartz.Core" />
            <add property="SchedulerHost" 
                 value="tcp://localhost:555/QuartzScheduler" /> <!-- Customize URL here -->
        </provider>
    </crystalQuartz>
    ```

3. Run you application and go to `YOUR_APP_URL/CrystalQuartzPanel.axd`

**Examples**
- [Simple Scheduler Example](https://github.com/guryanovev/CrystalQuartz/tree/master/examples/04_SystemWeb_Simple)
- [Remote Scheduler Example](https://github.com/guryanovev/CrystalQuartz/tree/master/examples/05_SystemWeb_Remote)

# Advanced Configuration #

CrystalQuartz supports some configuration options that could be passed to the panel at startup time to customize it's behavior.

For CrystalQuartz.Owin package pass options to `UseCrystalQuartz` method:

```C#
using CrystalQuartz.Application;

//...

app.UseCrystalQuartz(
    () => scheduler,
    new CrystalQuartzOptions
    {
        /* SET OPTIONS HERE */
    });
```

For CrystalQuartz.Simple and CrystalQuartz.Remote use the web.config:

```XML
<sectionGroup name="crystalQuartz" type="CrystalQuartz.Web.Configuration.CrystalQuartzConfigurationGroup">
  <section 
      name="provider" 
      type="CrystalQuartz.Web.Configuration.ProviderSectionHandler" 
      requirePermission="false" 
      allowDefinition="Everywhere" />
  <!-- options section is required -->
  <section 
      name="options" 
      type="CrystalQuartz.Web.Configuration.CrystalQuartzOptionsSection" 
      requirePermission="false" 
      allowDefinition="Everywhere" />
</sectionGroup>

<!-- ... -->
<crystalQuartz>
  <!-- ... -->
  <!-- PLACE OPTIONS HERE -->
  <options
      customCssUrl="CUSTOM_CSS_URL">
  </options>
</crystalQuartz>
```

Advanced configuration topics:

- [Detecting failed Quartz.NET runs](http://guryanovev.github.io/CrystalQuartz/advanced-config/detecting-failed-runs/)
- [Configuring Allowed Job Types](http://guryanovev.github.io/CrystalQuartz/advanced-config/configuring-allowed-job-types/)

List of available options:

| Property Name  | XML Attribute | Default |  |
| -------------- | ------------- |----------- |---|
| `Path`         | not supported | `'quartz'` | Url part for the panel. |
| `CustomCssUrl` | `customCssUrl`| `null`     | Valid absolute or relative url for custom CSS styles for the panel. See [custom styles example](//github.com/guryanovev/CrystalQuartz/tree/master/examples/06_CustomStyles) for details. |
| `LazyInit`     | not supported | `false`    | A flag indicating whether CrystalQuartz Panel should be initialized immediately after application start (`false`) or after first call of panel services (`true`). |
| `TimelineSpan` | not supported | 1 hour     | Span of timeline events displayed by the panel. |

*Please note:* The options list here is not complete, please check the [options class
source code](https://github.com/guryanovev/CrystalQuartz/blob/master/src/CrystalQuartz.Application/CrystalQuartzOptions.cs) for details.

# Building from source #

Please use `Build.bat` script to build the project locally. **Rebuilding directly from Visual Studio would not work correctly** because some client-side assets should be regenerated. `Build.bat` is a bootstrapper for [Rosalia build tool](https://github.com/rosaliafx/Rosalia). Prerquirements:

* NodeJs and npm should be installed on your machine and globally available.

Once the build completes successfully, you can Run the VS project as usually.

# Collaboration #

Please use [gitter](https://gitter.im/guryanovev/CrystalQuartz?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) to ask questions. Fill free to report issues and open pull requests.

# Changelog #

**Latest update:**

* timeline tooltip cosmetic fixes
* introduced trigger fire details dialog (opens on timeline item click)
   
<img src="http://guryanovev.github.io/CrystalQuartz/fire_details_dialog.png" title="Fire details dialog">

[See full changelog](//github.com/guryanovev/CrystalQuartz/wiki/Changelog)
