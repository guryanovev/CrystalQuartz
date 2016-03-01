![](http://guryanovev.github.io/CrystalQuartz/demo.png)

Crystal Quartz Panel is a lightweight, completely pluggable module for displaying Quartz.NET scheduler jobs information. This module can be embedded into an existing Web Forms or MVC application by referencing libs and adding a number of rows to a web.config file.

[![Build Status](https://travis-ci.org/guryanovev/CrystalQuartz.svg?branch=master)](https://travis-ci.org/guryanovev/CrystalQuartz)
[![Join the chat at https://gitter.im/guryanovev/CrystalQuartz](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/guryanovev/CrystalQuartz?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

#Features#

  * simple and lightweight, could be embedded into existing application;
  * displays basic scheduling information:
    * scheduler state and properties;
    * triggers by jobs and groups;
    * job properties (`JobDataMap`);
  * ability to perform simple action:
    * pause/resume triggers jobs and groups;
    * start/shutdown a scheduler;
    * execute a job on demand ("Trigger Now").
  * easy integration with a *remote scheduler* (see [examples](https://github.com/guryanovev/CrystalQuartz/tree/master/examples));

#Getting started#

CrystalQuartzPanel is implemented as an http module that embeds to an existing web-application. Configuration options depends of a kind of used scheduler.

**If Quartz Scheduler works in the app domain of your web application:**

  1. Install [CrystalQuartz.Simple](http://nuget.org/List/Packages/CrystalQuartz.Simple) NuGet package.

  ```Install-Package CrystalQuartz.Simple```

  2. Customize `SimpleSchedulerProvider` class that has been added by NuGet package
  
  ```C#
  public class SimpleSchedulerProvider : StdSchedulerProvider
  {
      protected override System.Collections.Specialized.NameValueCollection GetSchedulerProperties()
      {
          var properties = base.GetSchedulerProperties();
          // Place custom properties creation here:
          //     properties.Add("test1", "test1value");
          return properties;
      }

      protected override void InitScheduler(IScheduler scheduler)
      {
          // Put jobs creation code here
      }
  }
  ```
 
**If Quartz Scheduler works in a separate application (remote scheduler):**

  1. Install [CrystalQuartz.Remote](http://nuget.org/List/Packages/CrystalQuartz.Remote) NoGet package.
  
  ```Install-Package CrystalQuartz.Remote```
 
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

Checkout a working sample of remote scheduler integration: https://github.com/guryanovev/CrystalQuartz/tree/master/examples/RemoteScheduler

#Custom styles#

It is possible to apply some custom css to CrystalQuartz UI. To do so you need:

1. create a css file somewhere in your web application;
2. add a reference to this css file in CrystalQuartz config:
 
  ```xml
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
    <options
        customCssUrl="CUSTOM_CSS_URL">
    </options>
  </crystalQuartz>
  ```

See [custom styles example](https://github.com/guryanovev/CrystalQuartz/tree/master/examples/CustomStyling) for details.

#Collaboration#

Please use [gitter](https://gitter.im/guryanovev/CrystalQuartz?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) to ask questions. Fill free to report issues and open pull requests.

#Changelog#
 * **March, 2015**
   * web part completely rewritten as Single Page Application;
   * migrated to the latest Quartz.NET version.
 * **Junuary, 2016**
   * ability to set custom styles.




