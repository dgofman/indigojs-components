# [Indigo JS](http://indigojs.com/) Components

[![NPM version](https://badge.fury.io/js/indigojs-components.svg)](http://badge.fury.io/js/indigojs-components) [![Build Status](https://travis-ci.org/dgofman/indigojs-components.svg?branch=master)](https://travis-ci.org/dgofman/indigojs-components) [![Coverage Status](https://coveralls.io/repos/github/dgofman/indigojs-components/badge.svg?branch=master)](https://coveralls.io/github/dgofman/indigojs-components?branch=master)

[![NPM](https://nodei.co/npm/indigojs-components.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/indigojs-components)


This client-side framework is based on [EJS templates](https://github.com/mde/ejs/releases/latest) and [JQuery](http://jquery.com/). The IndigoJS-components library allows for the creation of UI components on HTML pages at runtime.
Javascript and EJS templates are created on the **browser** using ES5 standards, however [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) are also supported. To ensure [cross-platform compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Browser_compatibility), run the grunt command to compile EJS files.

For improved performance and CPU usage, use [IndigoJS NodeJs framework](https://github.com/dgofman/indigojs) to render EJS templates and compile LESS/CSS  on the **server side** .


<a target='_blank' href="https://indigojs-components.herokuapp.com/index?core">Demo</a>

This is [a link](http://example.com){:target="_blank"} that opens in a new window.

### Getting Started
 
 
###### 1. Download and install NodeJS

```
 http://nodejs.org/download/
```

###### 2. Install bower

```
npm install -g bower
```

###### 3. Download IndigoJS Components

```
git clone https://github.com/dgofman/indigojs-components.git
```

###### 4. Install and run demo

```
cd indigojs-components

npm install

npm start
```

### Additional Tips

To get the latest IndigoJS components updates, use the bower package manager to run your application.

```
bower install indigojs-components
```

Execute the grunt command after making changes to EJS or LESS files. This allows for the conversion of LESS to CSS and EJS to HTML.
```
grunt
```

To render IndigoJS components on the client side, include Embedded JavaScript Templates:
```<script type="text/javascript" src="js/ejs/ejs.min.js"></script>```

In order to load dynamic content at run-time, add the **indigo-builder** attribute to existing container(s) (*div, article, section, header, footer, nav etc.*) and point it to the desired content file.
```<section indigo-builder="build/ejs/content.html"></section> ```

Before closing a body tag add the **builder.js** parser.
 ```<script type="text/javascript" src="js/builder.js" indigo-pkgs="igo,jui"></script>```

The **indigo-pkgs**  attribute force preloads component libraries prior to the content pages being rendered.
Embedded packages:

 - igo - IndigoJS components
 - jui - jQuery UI widgets

**Hint:**
You can replace or attach the content file by using JavaScript:
```indigoJS.builder('NEW_CONTENT_FILE', document.querySelector('section'));```



### Components life cycle phases

**loaded**

###### Loaded is a static function that executes after a class has been loaded on the browser for the first time. Implementation of this function can contain global variables and functions within the ```window``` or ```jQuery``` scope.  

**register**

###### Register is a static function that executes after all classes have been loaded. Implementation of this function can contain class scope event handler(s).  

**preinit**

###### The Preinitialize function is called once the components are loaded and calls on each jquery element based on its class attribute selector. This allows for the initialization of DOM element default parameters, style, and behavior.

**init**

###### The Initialization function occurs after the creation of an object class. It is defined in the indigo core.js library and is executed prior to data-binding.


For more cool features check out [IndigoJS framework](https://github.com/dgofman/indigojs).