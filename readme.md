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

For quick start download [an examples package](http://code.google.com/p/crystal-quartz/downloads/detail?name=CrystalQuartz.Examples.1.0.40.zip). This package includes:

  * Simple Provider example (suitable when Quartz Scheduler works within Web Application);
  * Remote Provider example (suitable when a Scheduler works as a remote service outside of a Web Application);
  * Spring.NET Provider.

You can use NuGet to easily install CrystalQuartz to an existing application:

  * [CrystalQuartz.Simple](http://nuget.org/List/Packages/CrystalQuartz.Simple)
  * [CrystalQuartz.Remote](http://nuget.org/List/Packages/CrystalQuartz.Remote)

#Collaboration#

Please use [gitter](https://gitter.im/guryanovev/CrystalQuartz?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) to ask questions. Fill free to report issues and open pull requests.

#Changelog#
##March 1, 2015##
 * web part completely rewritten as Single Page Application;
 * migrated to the latest Quartz.NET version.
 
##Junuary 2016##
 * ability to set custom styles.




