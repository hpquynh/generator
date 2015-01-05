#Front-end Generators
For making life of front-end developer better, I created a set of generator to server multiple purposes. They are for front-end development only.

Copyright (c) 2014 Le Bao Phuc

##Pure & Email Generator

This is based on [h5bp.com](http://html5boilerplate.com/) and [its project](http://htmlemailboilerplate.com/), but more simpler.
For email, there is one more template optimized for real project, beside the original source.

##SCSS & LESS Generator

They are created by reusing and optimizing [XH Generator](https://github.com/xhtmlized/generator-xh). It's simpler without any setup step.

###Requirement

 - [Node](http://nodejs.org/)
 - Ruby
 - [SASS](http://sass-lang.com/) or [LESS](http://lesscss.org/)

###How to use

 - pick up one generator, SCSS or LESS
 - run `npm install` to set up project
 - run `grunt build` to build the entire project
 - run `grunt watch` to watch any change in developing

###Recommendation
Please read more about `node`, `grunt`, `scss` or `less` to get familiar with these things and then utilize features in each generator.

###Release Notes

* 1.0.0: initial release
* 1.1.0:
** update includes template
** add remfallback
** update build tasks
* 1.2.0:
** remove remfallback
** update dev dependencies
** update stuff (jquery, html, template,...)
** add common mixins

###General Notes

This is licensed under the MIT license.

**Made with Love & iLu**
