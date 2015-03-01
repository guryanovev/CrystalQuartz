Crystal Quartz Panel is a lightweight, completely pluggable module for displaying Quartz.NET scheduler jobs information. This module can be embedded into an existing Web Forms or MVC application by referencing libs and adding a number of rows to a web.config file.

#Update March 1, 2015#
 * web part completely rewritten as Single Page Application;
 * migrated to the latest Quartz.NET version.
 * ...more changes coming soon
 

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
  * easy integration with a *remote scheduler* (see [examples](http://code.google.com/p/crystal-quartz/downloads/detail?name=CrystalQuartz.Examples.1.0.40.zip));
  * out-of-the-box *Spring.NET* support (you should not reference Spring-related libs if you don't use Spring.NET integration).

#Getting started#

For quick start download [an examples package](http://code.google.com/p/crystal-quartz/downloads/detail?name=CrystalQuartz.Examples.1.0.40.zip). This package includes:

  * Simple Provider example (suitable when Quartz Scheduler works within Web Application);
  * Remote Provider example (suitable when a Scheduler works as a remote service outside of a Web Application);
  * Spring.NET Provider.

![](http://docs.nuget.org/images/nugetlogo.png)

You can use NuGet to easily install CrystalQuartz to an existing application:

  * [CrystalQuartz.Simple](http://nuget.org/List/Packages/CrystalQuartz.Simple)
  * [CrystalQuartz.Remote](http://nuget.org/List/Packages/CrystalQuartz.Remote)
