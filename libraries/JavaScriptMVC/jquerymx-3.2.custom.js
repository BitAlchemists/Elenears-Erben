
//jquery.lang.string.js

(function( $ ) {
	// Several of the methods in this plugin use code adapated from Prototype
	//  Prototype JavaScript framework, version 1.6.0.1
	//  (c) 2005-2007 Sam Stephenson
	var regs = {
		undHash: /_|-/,
		colons: /::/,
		words: /([A-Z]+)([A-Z][a-z])/g,
		lowUp: /([a-z\d])([A-Z])/g,
		dash: /([a-z\d])([A-Z])/g,
		replacer: /\{([^\}]+)\}/g,
		dot: /\./
	},
		getNext = function(current, nextPart, add){
			return current[nextPart] !== undefined ? current[nextPart] : ( add && (current[nextPart] = {}) );
		},
		isContainer = function(current){
			var type = typeof current;
			return type && (  type == 'function' || type == 'object' );
		},
		getObject = function( objectName, roots, add ) {
			
			var parts = objectName ? objectName.split(regs.dot) : [],
				length =  parts.length,
				currents = $.isArray(roots) ? roots : [roots || window],
				current,
				ret, 
				i,
				c = 0,
				type;
			
			if(length == 0){
				return currents[0];
			}
			while(current = currents[c++]){
				for (i =0; i < length - 1 && isContainer(current); i++ ) {
					current = getNext(current, parts[i], add);
				}
				if( isContainer(current) ) {
					
					ret = getNext(current, parts[i], add); 
					
					if( ret !== undefined ) {
						
						if ( add === false ) {
							delete current[parts[i]];
						}
						return ret;
						
					}
					
				}
			}
		},

		/** 
		 * @class jQuery.String
		 * @parent jquerymx.lang
		 * 
		 * A collection of useful string helpers. Available helpers are:
		 * <ul>
		 *   <li>[jQuery.String.capitalize|capitalize]: Capitalizes a string (some_string &raquo; Some_string)</li>
		 *   <li>[jQuery.String.camelize|camelize]: Capitalizes a string from something undercored 
		 *       (some_string &raquo; someString, some-string &raquo; someString)</li>
		 *   <li>[jQuery.String.classize|classize]: Like [jQuery.String.camelize|camelize], 
		 *       but the first part is also capitalized (some_string &raquo; SomeString)</li>
		 *   <li>[jQuery.String.niceName|niceName]: Like [jQuery.String.classize|classize], but a space separates each 'word' (some_string &raquo; Some String)</li>
		 *   <li>[jQuery.String.underscore|underscore]: Underscores a string (SomeString &raquo; some_string)</li>
		 *   <li>[jQuery.String.sub|sub]: Returns a string with {param} replaced values from data.
		 *       <code><pre>
		 *       $.String.sub("foo {bar}",{bar: "far"})
		 *       //-> "foo far"</pre></code>
		 *   </li>
		 * </ul>
		 * 
		 */
		str = $.String = $.extend( $.String || {} , {
			
			
			/**
			 * @function getObject
			 * Gets an object from a string.
			 * 
			 *     Foo = {Bar: {Zar: {"Ted"}}}
		 	 *     $.String.getobject("Foo.Bar.Zar") //-> "Ted"
			 * 
			 * @param {String} name the name of the object to look for
			 * @param {Array} [roots] an array of root objects to look for the 
			 *   name.  If roots is not provided, the window is used.
			 * @param {Boolean} [add] true to add missing objects to 
			 *  the path. false to remove found properties. undefined to 
			 *  not modify the root object
			 * @return {Object} The object.
			 */
			getObject : getObject,
			/**
			 * Capitalizes a string
			 * @param {String} s the string.
			 * @return {String} a string with the first character capitalized.
			 */
			capitalize: function( s, cache ) {
				return s.charAt(0).toUpperCase() + s.substr(1);
			},
			/**
			 * Capitalizes a string from something undercored. Examples:
			 * @codestart
			 * jQuery.String.camelize("one_two") //-> "oneTwo"
			 * "three-four".camelize() //-> threeFour
			 * @codeend
			 * @param {String} s
			 * @return {String} a the camelized string
			 */
			camelize: function( s ) {
				s = str.classize(s);
				return s.charAt(0).toLowerCase() + s.substr(1);
			},
			/**
			 * Like [jQuery.String.camelize|camelize], but the first part is also capitalized
			 * @param {String} s
			 * @return {String} the classized string
			 */
			classize: function( s , join) {
				var parts = s.split(regs.undHash),
					i = 0;
				for (; i < parts.length; i++ ) {
					parts[i] = str.capitalize(parts[i]);
				}

				return parts.join(join || '');
			},
			/**
			 * Like [jQuery.String.classize|classize], but a space separates each 'word'
			 * @codestart
			 * jQuery.String.niceName("one_two") //-> "One Two"
			 * @codeend
			 * @param {String} s
			 * @return {String} the niceName
			 */
			niceName: function( s ) {
				return str.classize(s,' ');
			},

			/**
			 * Underscores a string.
			 * @codestart
			 * jQuery.String.underscore("OneTwo") //-> "one_two"
			 * @codeend
			 * @param {String} s
			 * @return {String} the underscored string
			 */
			underscore: function( s ) {
				return s.replace(regs.colons, '/').replace(regs.words, '$1_$2').replace(regs.lowUp, '$1_$2').replace(regs.dash, '_').toLowerCase();
			},
			/**
			 * Returns a string with {param} replaced values from data.
			 * 
			 *     $.String.sub("foo {bar}",{bar: "far"})
			 *     //-> "foo far"
			 *     
			 * @param {String} s The string to replace
			 * @param {Object} data The data to be used to look for properties.  If it's an array, multiple
			 * objects can be used.
			 * @param {Boolean} [remove] if a match is found, remove the property from the object
			 */
			sub: function( s, data, remove ) {
				var obs = [];
				obs.push(s.replace(regs.replacer, function( whole, inside ) {
					//convert inside to type
					var ob = getObject(inside, data, typeof remove == 'boolean' ? !remove : remove),
						type = typeof ob;
					if((type === 'object' || type === 'function') && type !== null){
						obs.push(ob);
						return "";
					}else{
						return ""+ob;
					}
				}));
				return obs.length <= 1 ? obs[0] : obs;
			},
			_regs : regs
		});
})(jQuery);

//jquery.class.js

(function( $ ) {

	// =============== HELPERS =================

	    // if we are initializing a new class
	var initializing = false,
		makeArray = $.makeArray,
		isFunction = $.isFunction,
		isArray = $.isArray,
		extend = $.extend,
		getObject = $.String.getObject,
		concatArgs = function(arr, args){
			return arr.concat(makeArray(args));
		},
		
		// tests if we can get super in .toString()
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/,
		
		// overwrites an object with methods, sets up _super
		//   newProps - new properties
		//   oldProps - where the old properties might be
		//   addTo - what we are adding to
		inheritProps = function( newProps, oldProps, addTo ) {
			addTo = addTo || newProps
			for ( var name in newProps ) {
				// Check if we're overwriting an existing function
				addTo[name] = isFunction(newProps[name]) && 
							  isFunction(oldProps[name]) && 
							  fnTest.test(newProps[name]) ? (function( name, fn ) {
					return function() {
						var tmp = this._super,
							ret;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = oldProps[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				})(name, newProps[name]) : newProps[name];
			}
		},
		STR_PROTOTYPE = 'prototype'

	/**
	 * @class jQuery.Class
	 * @plugin jquery/class
	 * @parent jquerymx
	 * @download dist/jquery/jquery.class.js
	 * @test jquery/class/qunit.html
	 * 
	 * Class provides simulated inheritance in JavaScript. Use clss to bridge the gap between
	 * jQuery's functional programming style and Object Oriented Programming. It 
	 * is based off John Resig's [http://ejohn.org/blog/simple-javascript-inheritance/|Simple Class]
	 * Inheritance library.  Besides prototypal inheritance, it includes a few important features:
	 * 
	 *   - Static inheritance
	 *   - Introspection
	 *   - Namespaces
	 *   - Setup and initialization methods
	 *   - Easy callback function creation
	 * 
	 * 
	 * The [mvc.class Get Started with jQueryMX] has a good walkthrough of $.Class.
	 * 
	 * ## Static v. Prototype
	 * 
	 * Before learning about Class, it's important to
	 * understand the difference between
	 * a class's __static__ and __prototype__ properties.
	 * 
	 *     //STATIC
	 *     MyClass.staticProperty  //shared property
	 *     
	 *     //PROTOTYPE
	 *     myclass = new MyClass()
	 *     myclass.prototypeMethod() //instance method
	 * 
	 * A static (or class) property is on the Class constructor
	 * function itself
	 * and can be thought of being shared by all instances of the 
	 * Class. Prototype propertes are available only on instances of the Class.
	 * 
	 * ## A Basic Class
	 * 
	 * The following creates a Monster class with a
	 * name (for introspection), static, and prototype members.
	 * Every time a monster instance is created, the static
	 * count is incremented.
	 *
	 * @codestart
	 * $.Class('Monster',
	 * /* @static *|
	 * {
	 *   count: 0
	 * },
	 * /* @prototype *|
	 * {
	 *   init: function( name ) {
	 *
	 *     // saves name on the monster instance
	 *     this.name = name;
	 *
	 *     // sets the health
	 *     this.health = 10;
	 *
	 *     // increments count
	 *     this.constructor.count++;
	 *   },
	 *   eat: function( smallChildren ){
	 *     this.health += smallChildren;
	 *   },
	 *   fight: function() {
	 *     this.health -= 2;
	 *   }
	 * });
	 *
	 * hydra = new Monster('hydra');
	 *
	 * dragon = new Monster('dragon');
	 *
	 * hydra.name        // -> hydra
	 * Monster.count     // -> 2
	 * Monster.shortName // -> 'Monster'
	 *
	 * hydra.eat(2);     // health = 12
	 *
	 * dragon.fight();   // health = 8
	 *
	 * @codeend
	 *
	 * 
	 * Notice that the prototype <b>init</b> function is called when a new instance of Monster is created.
	 * 
	 * 
	 * ## Inheritance
	 * 
	 * When a class is extended, all static and prototype properties are available on the new class.
	 * If you overwrite a function, you can call the base class's function by calling
	 * <code>this._super</code>.  Lets create a SeaMonster class.  SeaMonsters are less
	 * efficient at eating small children, but more powerful fighters.
	 * 
	 * 
	 *     Monster("SeaMonster",{
	 *       eat: function( smallChildren ) {
	 *         this._super(smallChildren / 2);
	 *       },
	 *       fight: function() {
	 *         this.health -= 1;
	 *       }
	 *     });
	 *     
	 *     lockNess = new SeaMonster('Lock Ness');
	 *     lockNess.eat(4);   //health = 12
	 *     lockNess.fight();  //health = 11
	 * 
	 * ### Static property inheritance
	 * 
	 * You can also inherit static properties in the same way:
	 * 
	 *     $.Class("First",
	 *     {
	 *         staticMethod: function() { return 1;}
	 *     },{})
	 *
	 *     First("Second",{
	 *         staticMethod: function() { return this._super()+1;}
	 *     },{})
	 *
	 *     Second.staticMethod() // -> 2
	 * 
	 * ## Namespaces
	 * 
	 * Namespaces are a good idea! We encourage you to namespace all of your code.
	 * It makes it possible to drop your code into another app without problems.
	 * Making a namespaced class is easy:
	 * 
	 * 
	 *     $.Class("MyNamespace.MyClass",{},{});
	 *
	 *     new MyNamespace.MyClass()
	 * 
	 * 
	 * <h2 id='introspection'>Introspection</h2>
	 * 
	 * Often, it's nice to create classes whose name helps determine functionality.  Ruby on
	 * Rails's [http://api.rubyonrails.org/classes/ActiveRecord/Base.html|ActiveRecord] ORM class
	 * is a great example of this.  Unfortunately, JavaScript doesn't have a way of determining
	 * an object's name, so the developer must provide a name.  Class fixes this by taking a String name for the class.
	 * 
	 *     $.Class("MyOrg.MyClass",{},{})
	 *     MyOrg.MyClass.shortName //-> 'MyClass'
	 *     MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
	 * 
	 * The fullName (with namespaces) and the shortName (without namespaces) are added to the Class's
	 * static properties.
	 *
	 *
	 * ## Setup and initialization methods
	 * 
	 * <p>
	 * Class provides static and prototype initialization functions.
	 * These come in two flavors - setup and init.
	 * Setup is called before init and
	 * can be used to 'normalize' init's arguments.
	 * </p>
	 * <div class='whisper'>PRO TIP: Typically, you don't need setup methods in your classes. Use Init instead.
	 * Reserve setup methods for when you need to do complex pre-processing of your class before init is called.
	 *
	 * </div>
	 * @codestart
	 * $.Class("MyClass",
	 * {
	 *   setup: function() {} //static setup
	 *   init: function() {} //static constructor
	 * },
	 * {
	 *   setup: function() {} //prototype setup
	 *   init: function() {} //prototype constructor
	 * })
	 * @codeend
	 *
	 * ### Setup
	 * 
	 * Setup functions are called before init functions.  Static setup functions are passed
	 * the base class followed by arguments passed to the extend function.
	 * Prototype static functions are passed the Class constructor 
	 * function arguments.
	 * 
	 * If a setup function returns an array, that array will be used as the arguments
	 * for the following init method.  This provides setup functions the ability to normalize
	 * arguments passed to the init constructors.  They are also excellent places
	 * to put setup code you want to almost always run.
	 * 
	 * 
	 * The following is similar to how [jQuery.Controller.prototype.setup]
	 * makes sure init is always called with a jQuery element and merged options
	 * even if it is passed a raw
	 * HTMLElement and no second parameter.
	 * 
	 *     $.Class("jQuery.Controller",{
	 *       ...
	 *     },{
	 *       setup: function( el, options ) {
	 *         ...
	 *         return [$(el),
	 *                 $.extend(true,
	 *                    this.Class.defaults,
	 *                    options || {} ) ]
	 *       }
	 *     })
	 * 
	 * Typically, you won't need to make or overwrite setup functions.
	 * 
	 * ### Init
	 *
	 * Init functions are called after setup functions.
	 * Typically, they receive the same arguments
	 * as their preceding setup function.  The Foo class's <code>init</code> method
	 * gets called in the following example:
	 * 
	 *     $.Class("Foo", {
	 *       init: function( arg1, arg2, arg3 ) {
	 *         this.sum = arg1+arg2+arg3;
	 *       }
	 *     })
	 *     var foo = new Foo(1,2,3);
	 *     foo.sum //-> 6
	 * 
	 * ## Proxies
	 * 
	 * Similar to jQuery's proxy method, Class provides a
	 * [jQuery.Class.static.proxy proxy]
	 * function that returns a callback to a method that will always
	 * have
	 * <code>this</code> set to the class or instance of the class.
	 * 
	 * 
	 * The following example uses this.proxy to make sure
	 * <code>this.name</code> is available in <code>show</code>.
	 * 
	 *     $.Class("Todo",{
	 *       init: function( name ) { 
	 *       	this.name = name 
	 *       },
	 *       get: function() {
	 *         $.get("/stuff",this.proxy('show'))
	 *       },
	 *       show: function( txt ) {
	 *         alert(this.name+txt)
	 *       }
	 *     })
	 *     new Todo("Trash").get()
	 * 
	 * Callback is available as a static and prototype method.
	 * 
	 * ##  Demo
	 * 
	 * @demo jquery/class/class.html
	 * 
	 * 
	 * @constructor
	 * 
	 * To create a Class call:
	 * 
	 *     $.Class( [NAME , STATIC,] PROTOTYPE ) -> Class
	 * 
	 * <div class='params'>
	 *   <div class='param'><label>NAME</label><code>{optional:String}</code>
	 *   <p>If provided, this sets the shortName and fullName of the 
	 *      class and adds it and any necessary namespaces to the 
	 *      window object.</p>
	 *   </div>
	 *   <div class='param'><label>STATIC</label><code>{optional:Object}</code>
	 *   <p>If provided, this creates static properties and methods
	 *   on the class.</p>
	 *   </div>
	 *   <div class='param'><label>PROTOTYPE</label><code>{Object}</code>
	 *   <p>Creates prototype methods on the class.</p>
	 *   </div>
	 * </div>
	 * 
	 * When a Class is created, the static [jQuery.Class.static.setup setup] 
	 * and [jQuery.Class.static.init init]  methods are called.
	 * 
	 * To create an instance of a Class, call:
	 * 
	 *     new Class([args ... ]) -> instance
	 * 
	 * The created instance will have all the 
	 * prototype properties and methods defined by the PROTOTYPE object.
	 * 
	 * When an instance is created, the prototype [jQuery.Class.prototype.setup setup] 
	 * and [jQuery.Class.prototype.init init]  methods 
	 * are called.
	 */

	clss = $.Class = function() {
		if (arguments.length) {
			clss.extend.apply(clss, arguments);
		}
	};

	/* @Static*/
	extend(clss, {
		/**
		 * @function proxy
		 * Returns a callback function for a function on this Class.
		 * Proxy ensures that 'this' is set appropriately.  
		 * @codestart
		 * $.Class("MyClass",{
		 *     getData: function() {
		 *         this.showing = null;
		 *         $.get("data.json",this.proxy('gotData'),'json')
		 *     },
		 *     gotData: function( data ) {
		 *         this.showing = data;
		 *     }
		 * },{});
		 * MyClass.showData();
		 * @codeend
		 * <h2>Currying Arguments</h2>
		 * Additional arguments to proxy will fill in arguments on the returning function.
		 * @codestart
		 * $.Class("MyClass",{
		 *    getData: function( <b>callback</b> ) {
		 *      $.get("data.json",this.proxy('process',<b>callback</b>),'json');
		 *    },
		 *    process: function( <b>callback</b>, jsonData ) { //callback is added as first argument
		 *        jsonData.processed = true;
		 *        callback(jsonData);
		 *    }
		 * },{});
		 * MyClass.getData(showDataFunc)
		 * @codeend
		 * <h2>Nesting Functions</h2>
		 * Proxy can take an array of functions to call as 
		 * the first argument.  When the returned callback function
		 * is called each function in the array is passed the return value of the prior function.  This is often used
		 * to eliminate currying initial arguments.
		 * @codestart
		 * $.Class("MyClass",{
		 *    getData: function( callback ) {
		 *      //calls process, then callback with value from process
		 *      $.get("data.json",this.proxy(['process2',callback]),'json') 
		 *    },
		 *    process2: function( type,jsonData ) {
		 *        jsonData.processed = true;
		 *        return [jsonData];
		 *    }
		 * },{});
		 * MyClass.getData(showDataFunc);
		 * @codeend
		 * @param {String|Array} fname If a string, it represents the function to be called.  
		 * If it is an array, it will call each function in order and pass the return value of the prior function to the
		 * next function.
		 * @return {Function} the callback function.
		 */
		proxy: function( funcs ) {

			//args that should be curried
			var args = makeArray(arguments),
				self;

			// get the functions to callback
			funcs = args.shift();

			// if there is only one function, make funcs into an array
			if (!isArray(funcs) ) {
				funcs = [funcs];
			}
			
			// keep a reference to us in self
			self = this;
			
			
			return function class_cb() {
				// add the arguments after the curried args
				var cur = concatArgs(args, arguments),
					isString, 
					length = funcs.length,
					f = 0,
					func;
				
				// go through each function to call back
				for (; f < length; f++ ) {
					func = funcs[f];
					if (!func ) {
						continue;
					}
					
					// set called with the name of the function on self (this is how this.view works)
					isString = typeof func == "string";
					if ( isString && self._set_called ) {
						self.called = func;
					}
					
					// call the function
					cur = (isString ? self[func] : func).apply(self, cur || []);
					
					// pass the result to the next function (if there is a next function)
					if ( f < length - 1 ) {
						cur = !isArray(cur) || cur._use_call ? [cur] : cur
					}
				}
				return cur;
			}
		},
		/**
		 * @function newInstance
		 * Creates a new instance of the class.  This method is useful for creating new instances
		 * with arbitrary parameters.
		 * <h3>Example</h3>
		 * @codestart
		 * $.Class("MyClass",{},{})
		 * var mc = MyClass.newInstance.apply(null, new Array(parseInt(Math.random()*10,10))
		 * @codeend
		 * @return {class} instance of the class
		 */
		newInstance: function() {
			// get a raw instance objet (init is not called)
			var inst = this.rawInstance(),
				args;
				
			// call setup if there is a setup
			if ( inst.setup ) {
				args = inst.setup.apply(inst, arguments);
			}
			// call init if there is an init, if setup returned args, use those as the arguments
			if ( inst.init ) {
				inst.init.apply(inst, isArray(args) ? args : arguments);
			}
			return inst;
		},
		/**
		 * Setup gets called on the inherting class with the base class followed by the
		 * inheriting class's raw properties.
		 * 
		 * Setup will deeply extend a static defaults property on the base class with 
		 * properties on the base class.  For example:
		 * 
		 *     $.Class("MyBase",{
		 *       defaults : {
		 *         foo: 'bar'
		 *       }
		 *     },{})
		 * 
		 *     MyBase("Inheriting",{
		 *       defaults : {
		 *         newProp : 'newVal'
		 *       }
		 *     },{}
		 *     
		 *     Inheriting.defaults -> {foo: 'bar', 'newProp': 'newVal'}
		 * 
		 * @param {Object} baseClass the base class that is being inherited from
		 * @param {String} fullName the name of the new class
		 * @param {Object} staticProps the static properties of the new class
		 * @param {Object} protoProps the prototype properties of the new class
		 */
		setup: function( baseClass, fullName ) {
			// set defaults as the merger of the parent defaults and this object's defaults
			this.defaults = extend(true, {}, baseClass.defaults, this.defaults);
			return arguments;
		},
		rawInstance: function() {
			// prevent running init
			initializing = true;
			var inst = new this();
			initializing = false;
			// allow running init
			return inst;
		},
		/**
		 * Extends a class with new static and prototype functions.  There are a variety of ways
		 * to use extend:
		 * 
		 *     // with className, static and prototype functions
		 *     $.Class('Task',{ STATIC },{ PROTOTYPE })
		 *     // with just classname and prototype functions
		 *     $.Class('Task',{ PROTOTYPE })
		 *     // with just a className
		 *     $.Class('Task')
		 * 
		 * You no longer have to use <code>.extend</code>.  Instead, you can pass those options directly to
		 * $.Class (and any inheriting classes):
		 * 
		 *     // with className, static and prototype functions
		 *     $.Class('Task',{ STATIC },{ PROTOTYPE })
		 *     // with just classname and prototype functions
		 *     $.Class('Task',{ PROTOTYPE })
		 *     // with just a className
		 *     $.Class('Task')
		 * 
		 * @param {String} [fullName]  the classes name (used for classes w/ introspection)
		 * @param {Object} [klass]  the new classes static/class functions
		 * @param {Object} [proto]  the new classes prototype functions
		 * 
		 * @return {jQuery.Class} returns the new class
		 */
		extend: function( fullName, klass, proto ) {
			// figure out what was passed and normalize it
			if ( typeof fullName != 'string' ) {
				proto = klass;
				klass = fullName;
				fullName = null;
			}
			if (!proto ) {
				proto = klass;
				klass = null;
			}

			proto = proto || {};
			var _super_class = this,
				_super = this[STR_PROTOTYPE],
				name, shortName, namespace, prototype;

			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			prototype = new this();
			initializing = false;
			
			// Copy the properties over onto the new prototype
			inheritProps(proto, _super, prototype);

			// The dummy class constructor
			function Class() {
				// All construction is actually done in the init method
				if ( initializing ) return;

				// we are being called w/o new, we are extending
				if ( this.constructor !== Class && arguments.length ) { 
					return arguments.callee.extend.apply(arguments.callee, arguments)
				} else { //we are being called w/ new
					return this.Class.newInstance.apply(this.Class, arguments)
				}
			}
			// Copy old stuff onto class
			for ( name in this ) {
				if ( this.hasOwnProperty(name) ) {
					Class[name] = this[name];
				}
			}

			// copy new static props on class
			inheritProps(klass, this, Class);

			// do namespace stuff
			if ( fullName ) {

				var parts = fullName.split(/\./),
					shortName = parts.pop(),
					current = getObject(parts.join('.'), window, true),
					namespace = current;

				
				current[shortName] = Class;
			}

			// set things that can't be overwritten
			extend(Class, {
				prototype: prototype,
				/**
				 * @attribute namespace 
				 * The namespaces object
				 * 
				 *     $.Class("MyOrg.MyClass",{},{})
				 *     MyOrg.MyClass.namespace //-> MyOrg
				 * 
				 */
				namespace: namespace,
				/**
				 * @attribute shortName 
				 * The name of the class without its namespace, provided for introspection purposes.
				 * 
				 *     $.Class("MyOrg.MyClass",{},{})
				 *     MyOrg.MyClass.shortName //-> 'MyClass'
				 *     MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
				 * 
				 */
				shortName: shortName,
				constructor: Class,
				/**
				 * @attribute fullName 
				 * The full name of the class, including namespace, provided for introspection purposes.
				 * 
				 *     $.Class("MyOrg.MyClass",{},{})
				 *     MyOrg.MyClass.shortName //-> 'MyClass'
				 *     MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
				 * 
				 */
				fullName: fullName
			});

			//make sure our prototype looks nice
			Class[STR_PROTOTYPE].Class = Class[STR_PROTOTYPE].constructor = Class;

			

			// call the class setup
			var args = Class.setup.apply(Class, concatArgs([_super_class],arguments));
			
			// call the class init
			if ( Class.init ) {
				Class.init.apply(Class, args || []);
			}

			/* @Prototype*/
			return Class;
			/** 
			 * @function setup
			 * If a setup method is provided, it is called when a new 
			 * instances is created.  It gets passed the same arguments that
			 * were given to the Class constructor function (<code> new Class( arguments ... )</code>).
			 * 
			 *     $.Class("MyClass",
			 *     {
			 *        setup: function( val ) {
			 *           this.val = val;
			 *         }
			 *     })
			 *     var mc = new MyClass("Check Check")
			 *     mc.val //-> 'Check Check'
			 * 
			 * Setup is called before [jQuery.Class.prototype.init init].  If setup 
			 * return an array, those arguments will be used for init. 
			 * 
			 *     $.Class("jQuery.Controller",{
			 *       setup : function(htmlElement, rawOptions){
			 *         return [$(htmlElement), 
			 *                   $.extend({}, this.Class.defaults, rawOptions )] 
			 *       }
			 *     })
			 * 
			 * <div class='whisper'>PRO TIP: 
			 * Setup functions are used to normalize constructor arguments and provide a place for
			 * setup code that extending classes don't have to remember to call _super to
			 * run.
			 * </div>
			 * 
			 * Setup is not defined on $.Class itself, so calling super in inherting classes
			 * will break.  Don't do the following:
			 * 
			 *     $.Class("Thing",{
			 *       setup : function(){
			 *         this._super(); // breaks!
			 *       }
			 *     })
			 * 
			 * @return {Array|undefined} If an array is return, [jQuery.Class.prototype.init] is 
			 * called with those arguments; otherwise, the original arguments are used.
			 */
			//break up
			/** 
			 * @function init
			 * If an <code>init</code> method is provided, it gets called when a new instance
			 * is created.  Init gets called after [jQuery.Class.prototype.setup setup], typically with the 
			 * same arguments passed to the Class 
			 * constructor: (<code> new Class( arguments ... )</code>).  
			 * 
			 *     $.Class("MyClass",
			 *     {
			 *        init: function( val ) {
			 *           this.val = val;
			 *        }
			 *     })
			 *     var mc = new MyClass(1)
			 *     mc.val //-> 1
			 * 
			 * [jQuery.Class.prototype.setup Setup] is able to modify the arguments passed to init.  Read
			 * about it there.
			 * 
			 */
			//Breaks up code
			/**
			 * @attribute constructor
			 * 
			 * A reference to the Class (or constructor function).  This allows you to access 
			 * a class's static properties from an instance.
			 * 
			 * ### Quick Example
			 * 
			 *     // a class with a static property
			 *     $.Class("MyClass", {staticProperty : true}, {});
			 *     
			 *     // a new instance of myClass
			 *     var mc1 = new MyClass();
			 * 
			 *     // read the static property from the instance:
			 *     mc1.constructor.staticProperty //-> true
			 *     
			 * Getting static properties with the constructor property, like
			 * [jQuery.Class.static.fullName fullName], is very common.
			 * 
			 */
		}

	})





	clss.callback = clss[STR_PROTOTYPE].callback = clss[STR_PROTOTYPE].
	/**
	 * @function proxy
	 * Returns a method that sets 'this' to the current instance.  This does the same thing as 
	 * and is described better in [jQuery.Class.static.proxy].
	 * The only difference is this proxy works
	 * on a instance instead of a class.
	 * @param {String|Array} fname If a string, it represents the function to be called.  
	 * If it is an array, it will call each function in order and pass the return value of the prior function to the
	 * next function.
	 * @return {Function} the callback function
	 */
	proxy = clss.proxy;


})(jQuery);

//jquery.event.js



//jquery.event.destroyed.js

(function( $ ) {
	/**
	 * @attribute destroyed
	 * @parent specialevents
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/destroyed/destroyed.js
	 * @test jquery/event/destroyed/qunit.html
	 * Provides a destroyed event on an element.
	 * <p>
	 * The destroyed event is called when the element
	 * is removed as a result of jQuery DOM manipulators like remove, html,
	 * replaceWith, etc. Destroyed events do not bubble, so make sure you don't use live or delegate with destroyed
	 * events.
	 * </p>
	 * <h2>Quick Example</h2>
	 * @codestart
	 * $(".foo").bind("destroyed", function(){
	 *    //clean up code
	 * })
	 * @codeend
	 * <h2>Quick Demo</h2>
	 * @demo jquery/event/destroyed/destroyed.html 
	 * <h2>More Involved Demo</h2>
	 * @demo jquery/event/destroyed/destroyed_menu.html 
	 */

	var oldClean = jQuery.cleanData;

	$.cleanData = function( elems ) {
		for ( var i = 0, elem;
		(elem = elems[i]) !== undefined; i++ ) {
			$(elem).triggerHandler("destroyed");
			//$.event.remove( elem, 'destroyed' );
		}
		oldClean(elems);
	};

})(jQuery);

//jquery.controller.js

(function( $ ) {
	// ------- HELPER FUNCTIONS  ------
	
	// Binds an element, returns a function that unbinds
	var bind = function( el, ev, callback ) {
		var wrappedCallback,
			binder = el.bind && el.unbind ? el : $(isFunction(el) ? [el] : el);
		//this is for events like >click.
		if ( ev.indexOf(">") === 0 ) {
			ev = ev.substr(1);
			wrappedCallback = function( event ) {
				if ( event.target === el ) {
					callback.apply(this, arguments);
				} 
			};
		}
		binder.bind(ev, wrappedCallback || callback);
		// if ev name has >, change the name and bind
		// in the wrapped callback, check that the element matches the actual element
		return function() {
			binder.unbind(ev, wrappedCallback || callback);
			el = ev = callback = wrappedCallback = null;
		};
	},
		makeArray = $.makeArray,
		isArray = $.isArray,
		isFunction = $.isFunction,
		extend = $.extend,
		Str = $.String,
		each = $.each,
		
		STR_PROTOTYPE = 'prototype',
		STR_CONSTRUCTOR = 'constructor',
		slice = Array[STR_PROTOTYPE].slice,
		
		// Binds an element, returns a function that unbinds
		delegate = function( el, selector, ev, callback ) {
			var binder = el.delegate && el.undelegate ? el : $(isFunction(el) ? [el] : el)
			binder.delegate(selector, ev, callback);
			return function() {
				binder.undelegate(selector, ev, callback);
				binder = el = ev = callback = selector = null;
			};
		},
		
		// calls bind or unbind depending if there is a selector
		binder = function( el, ev, callback, selector ) {
			return selector ? delegate(el, selector, ev, callback) : bind(el, ev, callback);
		},
		
		// moves 'this' to the first argument, wraps it with jQuery if it's an element
		shifter = function shifter(context, name) {
			var method = typeof name == "string" ? context[name] : name;
			return function() {
				context.called = name;
    			return method.apply(context, [this.nodeName ? $(this) : this].concat( slice.call(arguments, 0) ) );
			};
		},
		// matches dots
		dotsReg = /\./g,
		// matches controller
		controllersReg = /_?controllers?/ig,
		//used to remove the controller from the name
		underscoreAndRemoveController = function( className ) {
			return Str.underscore(className.replace("jQuery.", "").replace(dotsReg, '_').replace(controllersReg, ""));
		},
		// checks if it looks like an action
		actionMatcher = /[^\w]/,
		// handles parameterized action names
		parameterReplacer = /\{([^\}]+)\}/g,
		breaker = /^(?:(.*?)\s)?([\w\.\:>]+)$/,
		basicProcessor,
		data = function(el, data){
			return $.data(el, "controllers", data)
		};
	/**
	 * @class jQuery.Controller
	 * @parent jquerymx
	 * @plugin jquery/controller
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/controller/controller.js
	 * @test jquery/controller/qunit.html
	 * @inherits jQuery.Class
	 * 
	 * jQuery.Controller helps create organized, memory-leak free, rapidly performing
	 * jQuery widgets.  Its extreme flexibility allows it to serve as both
	 * a traditional View and a traditional Controller.  
	 * 
	 * This means it is used to
	 * create things like tabs, grids, and contextmenus as well as 
	 * organizing them into higher-order business rules.
	 * 
	 * Controllers make your code deterministic, reusable, organized and can tear themselves 
	 * down auto-magically. Read about [http://jupiterjs.com/news/writing-the-perfect-jquery-plugin 
	 * the theory behind controller] and 
	 * a [http://jupiterjs.com/news/organize-jquery-widgets-with-jquery-controller walkthrough of its features]
	 * on Jupiter's blog. [mvc.controller Get Started with jQueryMX] also has a great walkthrough.
	 * 
	 * Controller inherits from [jQuery.Class $.Class] and makes heavy use of 
	 * [http://api.jquery.com/delegate/ event delegation]. Make sure 
	 * you understand these concepts before using it.
	 * 
	 * ## Basic Example
	 * 
	 * Instead of
	 * 
	 * 
	 *     $(function(){
	 *       $('#tabs').click(someCallbackFunction1)
	 *       $('#tabs .tab').click(someCallbackFunction2)
	 *       $('#tabs .delete click').click(someCallbackFunction3)
	 *     });
	 * 
	 * do this
	 * 
	 *     $.Controller('Tabs',{
	 *       click: function() {...},
	 *       '.tab click' : function() {...},
	 *       '.delete click' : function() {...}
	 *     })
	 *     $('#tabs').tabs();
	 * 
	 * 
	 * ## Tabs Example
	 * 
	 * @demo jquery/controller/controller.html
	 * 
	 * ## Using Controller
	 * 
	 * Controller helps you build and organize jQuery plugins.  It can be used
	 * to build simple widgets, like a slider, or organize multiple
	 * widgets into something greater.
	 * 
	 * To understand how to use Controller, you need to understand 
	 * the typical lifecycle of a jQuery widget and how that maps to
	 * controller's functionality:
	 * 
	 * ### A controller class is created.
	 *       
	 *     $.Controller("MyWidget",
	 *     {
	 *       defaults :  {
	 *         message : "Remove Me"
	 *       }
	 *     },
	 *     {
	 *       init : function(rawEl, rawOptions){ 
	 *         this.element.append(
	 *            "<div>"+this.options.message+"</div>"
	 *           );
	 *       },
	 *       "div click" : function(div, ev){ 
	 *         div.remove();
	 *       }  
	 *     }) 
	 *     
	 * This creates a <code>$.fn.my_widget</code> jQuery helper function
	 * that can be used to create a new controller instance on an element. Find
	 * more information [jquery.controller.plugin  here] about the plugin gets created 
	 * and the rules around its name.
	 *       
	 * ### An instance of controller is created on an element
	 * 
	 *     $('.thing').my_widget(options) // calls new MyWidget(el, options)
	 * 
	 * This calls <code>new MyWidget(el, options)</code> on 
	 * each <code>'.thing'</code> element.  
	 *     
	 * When a new [jQuery.Class Class] instance is created, it calls the class's
	 * prototype setup and init methods. Controller's [jQuery.Controller.prototype.setup setup]
	 * method:
	 *     
	 *  - Sets [jQuery.Controller.prototype.element this.element] and adds the controller's name to element's className.
	 *  - Merges passed in options with defaults object and sets it as [jQuery.Controller.prototype.options this.options]
	 *  - Saves a reference to the controller in <code>$.data</code>.
	 *  - [jquery.controller.listening Binds all event handler methods].
	 *   
	 * 
	 * ### The controller responds to events
	 * 
	 * Typically, Controller event handlers are automatically bound.  However, there are
	 * multiple ways to [jquery.controller.listening listen to events] with a controller.
	 * 
	 * Once an event does happen, the callback function is always called with 'this' 
	 * referencing the controller instance.  This makes it easy to use helper functions and
	 * save state on the controller.
	 * 
	 * 
	 * ### The widget is destroyed
	 * 
	 * If the element is removed from the page, the 
	 * controller's [jQuery.Controller.prototype.destroy] method is called.
	 * This is a great place to put any additional teardown functionality.
	 * 
	 * You can also teardown a controller programatically like:
	 * 
	 *     $('.thing').my_widget('destroy');
	 * 
	 * ## Todos Example
	 * 
	 * Lets look at a very basic example - 
	 * a list of todos and a button you want to click to create a new todo.
	 * Your HTML might look like:
	 * 
	 * @codestart html
	 * &lt;div id='todos'>
	 *  &lt;ol>
	 *    &lt;li class="todo">Laundry&lt;/li>
	 *    &lt;li class="todo">Dishes&lt;/li>
	 *    &lt;li class="todo">Walk Dog&lt;/li>
	 *  &lt;/ol>
	 *  &lt;a class="create">Create&lt;/a>
	 * &lt;/div>
	 * @codeend
	 * 
	 * To add a mousover effect and create todos, your controller might look like:
	 * 
	 *     $.Controller('Todos',{
	 *       ".todo mouseover" : function( el, ev ) {
	 *         el.css("backgroundColor","red")
	 *       },
	 *       ".todo mouseout" : function( el, ev ) {
	 *         el.css("backgroundColor","")
	 *       },
	 *       ".create click" : function() {
	 *         this.find("ol").append("&lt;li class='todo'>New Todo&lt;/li>"); 
	 *       }
	 *     })
	 * 
	 * Now that you've created the controller class, you've must attach the event handlers on the '#todos' div by
	 * creating [jQuery.Controller.prototype.setup|a new controller instance].  There are 2 ways of doing this.
	 * 
	 * @codestart
	 * //1. Create a new controller directly:
	 * new Todos($('#todos'));
	 * //2. Use jQuery function
	 * $('#todos').todos();
	 * @codeend
	 * 
	 * ## Controller Initialization
	 * 
	 * It can be extremely useful to add an init method with 
	 * setup functionality for your widget.
	 * 
	 * In the following example, I create a controller that when created, will put a message as the content of the element:
	 * 
	 *     $.Controller("SpecialController",
	 *     {
	 *       init: function( el, message ) {
	 *         this.element.html(message)
	 *       }
	 *     })
	 *     $(".special").special("Hello World")
	 * 
	 * ## Removing Controllers
	 * 
	 * Controller removal is built into jQuery.  So to remove a controller, you just have to remove its element:
	 * 
	 * @codestart
	 * $(".special_controller").remove()
	 * $("#containsControllers").html("")
	 * @codeend
	 * 
	 * It's important to note that if you use raw DOM methods (<code>innerHTML, removeChild</code>), the controllers won't be destroyed.
	 * 
	 * If you just want to remove controller functionality, call destroy on the controller instance:
	 * 
	 * @codestart
	 * $(".special_controller").controller().destroy()
	 * @codeend
	 * 
	 * ## Accessing Controllers
	 * 
	 * Often you need to get a reference to a controller, there are a few ways of doing that.  For the 
	 * following example, we assume there are 2 elements with <code>className="special"</code>.
	 * 
	 * @codestart
	 * //creates 2 foo controllers
	 * $(".special").foo()
	 * 
	 * //creates 2 bar controllers
	 * $(".special").bar()
	 * 
	 * //gets all controllers on all elements:
	 * $(".special").controllers() //-> [foo, bar, foo, bar]
	 * 
	 * //gets only foo controllers
	 * $(".special").controllers(FooController) //-> [foo, foo]
	 * 
	 * //gets all bar controllers
	 * $(".special").controllers(BarController) //-> [bar, bar]
	 * 
	 * //gets first controller
	 * $(".special").controller() //-> foo
	 * 
	 * //gets foo controller via data
	 * $(".special").data("controllers")["FooController"] //-> foo
	 * @codeend
	 * 
	 * ## Calling methods on Controllers
	 * 
	 * Once you have a reference to an element, you can call methods on it.  However, Controller has
	 * a few shortcuts:
	 * 
	 * @codestart
	 * //creates foo controller
	 * $(".special").foo({name: "value"})
	 * 
	 * //calls FooController.prototype.update
	 * $(".special").foo({name: "value2"})
	 * 
	 * //calls FooController.prototype.bar
	 * $(".special").foo("bar","something I want to pass")
	 * @codeend
	 * 
	 * These methods let you call one controller from another controller.
	 * 
	 */
	$.Class("jQuery.Controller",
	/** 
	 * @Static
	 */
	{
		/**
		 * Does 2 things:
		 * 
		 *   - Creates a jQuery helper for this controller.</li>
		 *   - Calculates and caches which functions listen for events.</li>
		 *    
		 * ### jQuery Helper Naming Examples
		 * 
		 * 
		 *     "TaskController" -> $().task_controller()
		 *     "Controllers.Task" -> $().controllers_task()
		 * 
		 */
		setup: function() {
			// Allow contollers to inherit "defaults" from superclasses as it done in $.Class
			this._super.apply(this, arguments);

			// if you didn't provide a name, or are controller, don't do anything
			if (!this.shortName || this.fullName == "jQuery.Controller" ) {
				return;
			}
			// cache the underscored names
			this._fullName = underscoreAndRemoveController(this.fullName);
			this._shortName = underscoreAndRemoveController(this.shortName);

			var controller = this,
				/**
				 * @attribute pluginName
				 * Setting the <code>pluginName</code> property allows you
				 * to change the jQuery plugin helper name from its 
				 * default value.
				 * 
				 *     $.Controller("Mxui.Layout.Fill",{
				 *       pluginName: "fillWith"
				 *     },{});
				 *     
				 *     $("#foo").fillWith();
				 */
				pluginname = this.pluginName || this._fullName,
				funcName, forLint;

			// create jQuery plugin
			if (!$.fn[pluginname] ) {
				$.fn[pluginname] = function( options ) {

					var args = makeArray(arguments),
						//if the arg is a method on this controller
						isMethod = typeof options == "string" && isFunction(controller[STR_PROTOTYPE][options]),
						meth = args[0];
					return this.each(function() {
						//check if created
						var controllers = data(this),
							//plugin is actually the controller instance
							plugin = controllers && controllers[pluginname];

						if ( plugin ) {
							if ( isMethod ) {
								// call a method on the controller with the remaining args
								plugin[meth].apply(plugin, args.slice(1));
							} else {
								// call the plugin's update method
								plugin.update.apply(plugin, args);
							}

						} else {
							//create a new controller instance
							controller.newInstance.apply(controller, [this].concat(args));
						}
					});
				};
			}

			// make sure listensTo is an array
			
			// calculate and cache actions
			this.actions = {};

			for ( funcName in this[STR_PROTOTYPE] ) {
				if (funcName == 'constructor' || !isFunction(this[STR_PROTOTYPE][funcName]) ) {
					continue;
				}
				if ( this._isAction(funcName) ) {
					this.actions[funcName] = this._action(funcName);
				}
			}
		},
		hookup: function( el ) {
			return new this(el);
		},

		/**
		 * @hide
		 * @param {String} methodName a prototype function
		 * @return {Boolean} truthy if an action or not
		 */
		_isAction: function( methodName ) {
			if ( actionMatcher.test(methodName) ) {
				return true;
			} else {
				return $.inArray(methodName, this.listensTo) > -1 || $.event.special[methodName] || processors[methodName];
			}

		},
		/**
		 * @hide
		 * This takes a method name and the options passed to a controller
		 * and tries to return the data necessary to pass to a processor
		 * (something that binds things).
		 * 
		 * For performance reasons, this called twice.  First, it is called when 
		 * the Controller class is created.  If the methodName is templated
		 * like : "{window} foo", it returns null.  If it is not templated
		 * it returns event binding data.
		 * 
		 * The resulting data is added to this.actions.
		 * 
		 * When a controller instance is created, _action is called again, but only
		 * on templated actions.  
		 * 
		 * @param {Object} methodName the method that will be bound
		 * @param {Object} [options] first param merged with class default options
		 * @return {Object} null or the processor and pre-split parts.  
		 * The processor is what does the binding/subscribing.
		 */
		_action: function( methodName, options ) {
			// reset the test index
			parameterReplacer.lastIndex = 0;
			
			//if we don't have options (a controller instance), we'll run this later
			if (!options && parameterReplacer.test(methodName) ) {
				return null;
			}
			// If we have options, run sub to replace templates "{}" with a value from the options
			// or the window
			var convertedName = options ? Str.sub(methodName, [options, window]) : methodName,
				
				// If a "{}" resolves to an object, convertedName will be an array
				arr = isArray(convertedName),
				
				// get the parts of the function = [convertedName, delegatePart, eventPart]
				parts = (arr ? convertedName[1] : convertedName).match(breaker),
				event = parts[2],
				processor = processors[event] || basicProcessor;
			return {
				processor: processor,
				parts: parts,
				delegate : arr ? convertedName[0] : undefined
			};
		},
		/**
		 * @attribute processors
		 * An object of {eventName : function} pairs that Controller uses to hook up events
		 * auto-magically.  A processor function looks like:
		 * 
		 *     jQuery.Controller.processors.
		 *       myprocessor = function( el, event, selector, cb, controller ) {
		 *          //el - the controller's element
		 *          //event - the event (myprocessor)
		 *          //selector - the left of the selector
		 *          //cb - the function to call
		 *          //controller - the binding controller
		 *       };
		 * 
		 * This would bind anything like: "foo~3242 myprocessor".
		 * 
		 * The processor must return a function that when called, 
		 * unbinds the event handler.
		 * 
		 * Controller already has processors for the following events:
		 * 
		 *   - change 
		 *   - click 
		 *   - contextmenu 
		 *   - dblclick 
		 *   - focusin
		 *   - focusout
		 *   - keydown 
		 *   - keyup 
		 *   - keypress 
		 *   - mousedown 
		 *   - mouseenter
		 *   - mouseleave
		 *   - mousemove 
		 *   - mouseout 
		 *   - mouseover 
		 *   - mouseup 
		 *   - reset 
		 *   - resize 
		 *   - scroll 
		 *   - select 
		 *   - submit  
		 * 
		 * Listen to events on the document or window 
		 * with templated event handlers:
		 * 
		 *
		 *     $.Controller('Sized',{
		 *       "{window} resize" : function(){
		 *         this.element.width(this.element.parent().width() / 2);
		 *       }
		 *     });
		 *     
		 *     $('.foo').sized();
		 */
		processors: {},
		/**
		 * @attribute listensTo
		 * An array of special events this controller 
		 * listens too.  You only need to add event names that
		 * are whole words (ie have no special characters).
		 * 
		 *     $.Controller('TabPanel',{
		 *       listensTo : ['show']
		 *     },{
		 *       'show' : function(){
		 *         this.element.show();
		 *       }
		 *     })
		 *     
		 *     $('.foo').tab_panel().trigger("show");
		 * 
		 */
		listensTo: [],
		/**
		 * @attribute defaults
		 * A object of name-value pairs that act as default values for a controller's 
		 * [jQuery.Controller.prototype.options options].
		 * 
		 *     $.Controller("Message",
		 *     {
		 *       defaults : {
		 *         message : "Hello World"
		 *       }
		 *     },{
		 *       init : function(){
		 *         this.element.text(this.options.message);
		 *       }
		 *     })
		 *     
		 *     $("#el1").message(); //writes "Hello World"
		 *     $("#el12").message({message: "hi"}); //writes hi
		 *     
		 * In [jQuery.Controller.prototype.setup setup] the options passed to the controller
		 * are merged with defaults.  This is not a deep merge.
		 */
		defaults: {}
	},
	/** 
	 * @Prototype
	 */
	{
		/**
		 * Setup is where most of controller's magic happens.  It does the following:
		 * 
		 * ### 1. Sets this.element
		 * 
		 * The first parameter passed to new Controller(el, options) is expected to be 
		 * an element.  This gets converted to a jQuery wrapped element and set as
		 * [jQuery.Controller.prototype.element this.element].
		 * 
		 * ### 2. Adds the controller's name to the element's className.
		 * 
		 * Controller adds it's plugin name to the element's className for easier 
		 * debugging.  For example, if your Controller is named "Foo.Bar", it adds
		 * "foo_bar" to the className.
		 * 
		 * ### 3. Saves the controller in $.data
		 * 
		 * A reference to the controller instance is saved in $.data.  You can find 
		 * instances of "Foo.Bar" like: 
		 * 
		 *     $("#el").data("controllers")['foo_bar'].
		 * 
		 * ### Binds event handlers
		 * 
		 * Setup does the event binding described in [jquery.controller.listening Listening To Events].
		 * 
		 * @param {HTMLElement} element the element this instance operates on.
		 * @param {Object} [options] option values for the controller.  These get added to
		 * this.options and merged with [jQuery.Controller.static.defaults defaults].
		 * @return {Array} return an array if you wan to change what init is called with. By
		 * default it is called with the element and options passed to the controller.
		 */
		setup: function( element, options ) {
			var funcName, ready, cls = this[STR_CONSTRUCTOR];

			//want the raw element here
			element = element.jquery ? element[0] : element;

			//set element and className on element
			var pluginname = cls.pluginName || cls._fullName;

			//set element and className on element
			this.element = $(element).addClass(pluginname);

			//set in data
			(data(element) || data(element, {}))[pluginname] = this;

			
			/**
			 * @attribute options
			 * Options is [jQuery.Controller.static.defaults] merged with the 2nd argument
			 * passed to a controller (or the first argument passed to the 
			 * [jquery.controller.plugin controller's jQuery plugin]).
			 * 
			 * For example:
			 * 
			 *     $.Controller("Tabs", 
			 *     {
			 *        defaults : {
			 *          activeClass: "ui-active-state"
			 *        }
			 *     },
			 *     {
			 *        init : function(){
			 *          this.element.addClass(this.options.activeClass);
			 *        }
			 *     })
			 *     
			 *     $("#tabs1").tabs()                         // adds 'ui-active-state'
			 *     $("#tabs2").tabs({activeClass : 'active'}) // adds 'active'
			 *     
			 *  
			 */
			this.options = extend( extend(true, {}, cls.defaults), options);

			

			/**
			 * @attribute called
			 * String name of current function being called on controller instance.  This is 
			 * used for picking the right view in render.
			 * @hide
			 */
			this.called = "init";

			// bind all event handlers
			this.bind();

			/**
			 * @attribute element
			 * The controller instance's delegated element. This 
			 * is set by [jQuery.Controller.prototype.setup setup]. It 
			 * is a jQuery wrapped element.
			 * 
			 * For example, if I add MyWidget to a '#myelement' element like:
			 * 
			 *     $.Controller("MyWidget",{
			 *       init : function(){
			 *         this.element.css("color","red")
			 *       }
			 *     })
			 *     
			 *     $("#myelement").my_widget()
			 * 
			 * MyWidget will turn #myelement's font color red.
			 * 
			 * ## Using a different element.
			 * 
			 * Sometimes, you want a different element to be this.element.  A
			 * very common example is making progressively enhanced form widgets.
			 * 
			 * To change this.element, overwrite Controller's setup method like:
			 * 
			 *     $.Controller("Combobox",{
			 *       setup : function(el, options){
			 *          this.oldElement = $(el);
			 *          var newEl = $('<div/>');
			 *          this.oldElement.wrap(newEl);
			 *          this._super(newEl, options);
			 *       },
			 *       init : function(){
			 *          this.element //-> the div
			 *       },
			 *       ".option click" : function(){
			 *         // event handler bound on the div
			 *       },
			 *       destroy : function(){
			 *          var div = this.element; //save reference
			 *          this._super();
			 *          div.replaceWith(this.oldElement);
			 *       }
			 *     }
			 */
			return this.element;
		},
		/**
		 * Bind attaches event handlers that will be 
		 * removed when the controller is removed.  
		 * 
		 * This used to be a good way to listen to events outside the controller's
		 * [jQuery.Controller.prototype.element element].  However,
		 * using templated event listeners is now the prefered way of doing this.
		 * 
		 * ### Example:
		 * 
		 *     init: function() {
		 *        // calls somethingClicked(el,ev)
		 *        this.bind('click','somethingClicked') 
		 *     
		 *        // calls function when the window is clicked
		 *        this.bind(window, 'click', function(ev){
		 *          //do something
		 *        })
		 *     },
		 *     somethingClicked: function( el, ev ) {
		 *       
		 *     }
		 * 
		 * @param {HTMLElement|jQuery.fn|Object} [el=this.element] 
		 * The element to be bound.  If an eventName is provided,
		 * the controller's element is used instead.
		 * 
		 * @param {String} eventName The event to listen for.
		 * @param {Function|String} func A callback function or the String name of a controller function.  If a controller
		 * function name is given, the controller function is called back with the bound element and event as the first
		 * and second parameter.  Otherwise the function is called back like a normal bind.
		 * @return {Integer} The id of the binding in this._bindings
		 */
		bind: function( el, eventName, func ) {
			if( el === undefined ) {
				//adds bindings
				this._bindings = [];
				//go through the cached list of actions and use the processor to bind
				
				var cls = this[STR_CONSTRUCTOR],
					bindings = this._bindings,
					actions = cls.actions,
					element = this.element;
					
				for ( funcName in actions ) {
					if ( actions.hasOwnProperty(funcName) ) {
						ready = actions[funcName] || cls._action(funcName, this.options);
						bindings.push(
							ready.processor(ready.delegate || element, 
							                ready.parts[2], 
											ready.parts[1], 
											funcName, 
											this));
					}
				}
	
	
				//setup to be destroyed ... don't bind b/c we don't want to remove it
				var destroyCB = shifter(this,"destroy");
				element.bind("destroyed", destroyCB);
				bindings.push(function( el ) {
					$(el).unbind("destroyed", destroyCB);
				});
				return bindings.length;
			}
			if ( typeof el == 'string' ) {
				func = eventName;
				eventName = el;
				el = this.element;
			}
			return this._binder(el, eventName, func);
		},
		_binder: function( el, eventName, func, selector ) {
			if ( typeof func == 'string' ) {
				func = shifter(this,func);
			}
			this._bindings.push(binder(el, eventName, func, selector));
			return this._bindings.length;
		},
		_unbind : function(){
			var el = this.element[0];
			each(this._bindings, function( key, value ) {
				value(el);
			});
			//adds bindings
			this._bindings = [];
		},
		/**
		 * Delegate will delegate on an elememt and will be undelegated when the controller is removed.
		 * This is a good way to delegate on elements not in a controller's element.<br/>
		 * <h3>Example:</h3>
		 * @codestart
		 * // calls function when the any 'a.foo' is clicked.
		 * this.delegate(document.documentElement,'a.foo', 'click', function(ev){
		 *   //do something
		 * })
		 * @codeend
		 * @param {HTMLElement|jQuery.fn} [element=this.element] the element to delegate from
		 * @param {String} selector the css selector
		 * @param {String} eventName the event to bind to
		 * @param {Function|String} func A callback function or the String name of a controller function.  If a controller
		 * function name is given, the controller function is called back with the bound element and event as the first
		 * and second parameter.  Otherwise the function is called back like a normal bind.
		 * @return {Integer} The id of the binding in this._bindings
		 */
		delegate: function( element, selector, eventName, func ) {
			if ( typeof element == 'string' ) {
				func = eventName;
				eventName = selector;
				selector = element;
				element = this.element;
			}
			return this._binder(element, eventName, func, selector);
		},
		/**
		 * Update extends [jQuery.Controller.prototype.options this.options] 
		 * with the `options` argument and rebinds all events.  It basically
		 * re-configures the controller.
		 * 
		 * For example, the following controller wraps a recipe form. When the form
		 * is submitted, it creates the recipe on the server.  When the recipe
		 * is `created`, it resets the form with a new instance.
		 * 
		 *     $.Controller('Creator',{
		 *       "{recipe} created" : function(){
		 *         this.update({recipe : new Recipe()});
		 *     	   this.element[0].reset();
		 *     	   this.find("[type=submit]").val("Create Recipe")
		 *       },
		 *       "submit" : function(el, ev){
		 *       	ev.preventDefault();
		 *          var recipe = this.options.recipe;
		 *          recipe.attrs( this.element.formParams() );
		 *     	    this.find("[type=submit]").val("Saving...")
		 *          recipe.save();
		 *       }
		 *     });
		 *     $('#createRecipes').creator({recipe : new Recipe()})
		 * 
		 * 
		 * @demo jquery/controller/demo-update.html
		 * 
		 * Update is called if a controller's [jquery.controller.plugin jQuery helper] is 
		 * called on an element that already has a controller instance
		 * of the same type. 
		 * 
		 * For example, a widget that listens for model updates
		 * and updates it's html would look like.  
		 * 
		 *     $.Controller('Updater',{
		 *       // when the controller is created, update the html
		 *       init : function(){
		 *       	this.updateView();
		 *       },
		 *       
		 *       // update the html with a template
		 *       updateView : function(){
		 *          this.element.html( "content.ejs",
		 *                             this.options.model ); 
		 *       },
		 *       
		 *       // if the model is updated
		 *       "{model} updated" : function(){
		 *          this.updateView();
		 *       },
		 *       update : function(options){
		 *          // make sure you call super
		 *          this._super(options);
		 *          
		 *          this.updateView();
		 *       }
		 *     })
		 * 
		 *     // create the controller
		 *     // this calls init
		 *     $('#item').updater({model: recipe1});
		 *     
		 *     // later, update that model
		 *     // this calls "{model} updated"
		 *     recipe1.update({name: "something new"});
		 *     
		 *     // later, update the controller with a new recipe
		 *     // this calls update
		 *     $('#item').updater({model: recipe2});
		 *     
		 *     // later, update the new model
		 *     // this calls "{model} updated"
		 *     recipe2.update({name: "something newer"});
		 * 
		 * _NOTE:_ If you overwrite `update`, you probably need to call
		 * this._super.
		 * 
		 * ### Example
		 * 
		 *     $.Controller("Thing",{
		 *       init: function( el, options ) {
		 *         alert( 'init:'+this.options.prop )
		 *       },
		 *       update: function( options ) {
		 *         this._super(options);
		 *         alert('update:'+this.options.prop)
		 *       }
		 *     });
		 *     $('#myel').thing({prop : 'val1'}); // alerts init:val1
		 *     $('#myel').thing({prop : 'val2'}); // alerts update:val2
		 * 
		 * @param {Object} options A list of options to merge with 
		 * [jQuery.Controller.prototype.options this.options].  Often, this method
		 * is called by the [jquery.controller.plugin jQuery helper function].
		 */
		update: function( options ) {
			extend(this.options, options);
			this._unbind();
			this.bind();
		},
		/**
		 * Destroy unbinds and undelegates all event handlers on this controller, 
		 * and prevents memory leaks.  This is called automatically
		 * if the element is removed.  You can overwrite it to add your own
		 * teardown functionality:
		 * 
		 *     $.Controller("ChangeText",{
		 *       init : function(){
		 *         this.oldText = this.element.text();
		 *         this.element.text("Changed!!!")
		 *       },
		 *       destroy : function(){
		 *         this.element.text(this.oldText);
		 *         this._super(); //Always call this!
		 *     })
		 * 
		 * Make sure you always call <code>_super</code> when overwriting
		 * controller's destroy event.  The base destroy functionality unbinds
		 * all event handlers the controller has created.
		 * 
		 * You could call destroy manually on an element with ChangeText
		 * added like:
		 * 
		 *     $("#changed").change_text("destroy");
		 * 
		 */
		destroy: function() {
			if ( this._destroyed ) {
				throw this[STR_CONSTRUCTOR].shortName + " controller already deleted";
			}
			var self = this,
				fname = this[STR_CONSTRUCTOR].pluginName || this[STR_CONSTRUCTOR]._fullName,
				controllers;
			
			// mark as destroyed
			this._destroyed = true;
			
			// remove the className
			this.element.removeClass(fname);

			// unbind bindings
			this._unbind();
			// clean up
			delete this._actions;

			delete this.element.data("controllers")[fname];
			
			$(this).triggerHandler("destroyed"); //in case we want to know if the controller is removed
			
			this.element = null;
		},
		/**
		 * Queries from the controller's element.
		 * @codestart
		 * ".destroy_all click" : function() {
		 *    this.find(".todos").remove();
		 * }
		 * @codeend
		 * @param {String} selector selection string
		 * @return {jQuery.fn} returns the matched elements
		 */
		find: function( selector ) {
			return this.element.find(selector);
		},
		//tells callback to set called on this.  I hate this.
		_set_called: true
	});

	var processors = $.Controller.processors,

	//------------- PROCESSSORS -----------------------------
	//processors do the binding.  They return a function that
	//unbinds when called.
	//the basic processor that binds events
	basicProcessor = function( el, event, selector, methodName, controller ) {
		return binder(el, event, shifter(controller, methodName), selector);
	};




	//set commong events to be processed as a basicProcessor
	each("change click contextmenu dblclick keydown keyup keypress mousedown mousemove mouseout mouseover mouseup reset resize scroll select submit focusin focusout mouseenter mouseleave".split(" "), function( i, v ) {
		processors[v] = basicProcessor;
	});
	/**
	 *  @add jQuery.fn
	 */

	//used to determine if a controller instance is one of controllers
	//controllers can be strings or classes
	var i, isAControllerOf = function( instance, controllers ) {
		for ( i = 0; i < controllers.length; i++ ) {
			if ( typeof controllers[i] == 'string' ? instance[STR_CONSTRUCTOR]._shortName == controllers[i] : instance instanceof controllers[i] ) {
				return true;
			}
		}
		return false;
	};
	$.fn.extend({
		/**
		 * @function controllers
		 * Gets all controllers in the jQuery element.
		 * @return {Array} an array of controller instances.
		 */
		controllers: function() {
			var controllerNames = makeArray(arguments),
				instances = [],
				controllers, c, cname;
			//check if arguments
			this.each(function() {
	
				controllers = $.data(this, "controllers");
				for ( cname in controllers ) {
					if ( controllers.hasOwnProperty(cname) ) {
						c = controllers[cname];
						if (!controllerNames.length || isAControllerOf(c, controllerNames) ) {
							instances.push(c);
						}
					}
				}
			});
			return instances;
		},
		/**
		 * @function controller
		 * Gets a controller in the jQuery element.  With no arguments, returns the first one found.
		 * @param {Object} controller (optional) if exists, the first controller instance with this class type will be returned.
		 * @return {jQuery.Controller} the first controller.
		 */
		controller: function( controller ) {
			return this.controllers.apply(this, arguments)[0];
		}
	});
	

})(jQuery);

//jquery.model.js

(function() {
	
	//helper stuff for later.  Eventually, might not need jQuery.
	var underscore = $.String.underscore,
		classize = $.String.classize,
		isArray = $.isArray,
		makeArray = $.makeArray,
		extend = $.extend,
		each = $.each,
		reqType = /GET|POST|PUT|DELETE/i,
		ajax = function(ajaxOb, attrs, success, error, fixture, type, dataType){
			var dataType = dataType || "json",
				src = "",
				tmp;
			if(typeof ajaxOb == "string"){
				var sp = ajaxOb.indexOf(" ")
				if( sp > 2 && sp <7){
					tmp = ajaxOb.substr(0,sp);
					if(reqType.test(tmp)){
						type = tmp;
					}else{
						dataType = tmp;
					}
					src = ajaxOb.substr(sp+1)
				}else{
					src = ajaxOb;
				}
			}
			typeof attrs == "object" && (!isArray(attrs)) && (attrs =  extend({},attrs))
			
			var url = $.String.sub(src, attrs, true)
			return $.ajax({
				url : url,
				data : attrs,
				success : success,
				error: error,
				type : type || "post",
				dataType : dataType,
				fixture: fixture
			});
		},
		//guesses at a fixture name
		fixture = function(extra, or){
			var u = underscore( this.shortName ),
				f = "-"+u+(extra||"");
			return $.fixture && $.fixture[f] ? f : or ||
				"//"+underscore( this.fullName )
						.replace(/\.models\..*/,"")
						.replace(/\./g,"/")+"/fixtures/"+u+
						(extra || "")+".json";
		},
		addId = function(attrs, id){
			attrs = attrs || {};
			var identity = this.id;
			if(attrs[identity] && attrs[identity] !== id){
				attrs["new"+$.String.capitalize(id)] = attrs[identity];
				delete attrs[identity];
			}
			attrs[identity] = id;
			return attrs;
		},
		getList = function(type){
			var listType = type || $.Model.List || Array;
			return new listType();
		},
		getId = function(inst){
			return inst[inst.constructor.id]
		},
		unique = function(items){
	        var collect = [];
	        for(var i=0; i < items.length; i++){
	            if(!items[i]["__u Nique"]){
	                collect.push(items[i]);
	                items[i]["__u Nique"] = true;
	            }
	        }
	        for(i=0; i< collect.length; i++){
	            delete collect[i]["__u Nique"];
	        }
	        return collect;
	    },
		// makes a deferred request
		makeRequest = function(self, type, success, error, method){
			var deferred = $.Deferred(),
				resolve = function(data){
					self[method || type+"d"](data);
					deferred.resolveWith(self,[self, data, type]);
				},
				reject = function(data){
					deferred.rejectWith(self, [data])
				},
				args = [self.serialize(), resolve, reject],
				constructor = self.constructor;
				
			if(type == 'destroy'){
				args.shift();
			}	
				
			if(type !== 'create' ){
				args.unshift(getId(self))
			} 
			
			deferred.then(success);
			deferred.fail(error);
			
			constructor[type].apply(constructor, args);
				
			return deferred.promise();
		},
		// a quick way to tell if it's an object and not some string
		isObject = function(obj){
			return typeof obj === 'object' && obj !== null && obj;
		},
		$method = function(name){
			return function( eventType, handler ) {
				$.fn[name].apply($([this]), arguments);
				return this;
			}
		},
		bind = $method('bind'),
		unbind = $method('unbind'),
		STR_CONSTRUCTOR = 'constructor';
	/**
	 * @class jQuery.Model
	 * @parent jquerymx
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/model.js
	 * @test jquery/model/qunit.html
	 * @plugin jquery/model
	 * 
	 * Models super-charge an application's
	 * data layer, making it easy to:
	 * 
	 *  - Get and modify data from the server
	 *  - Listen to changes in data
	 *  - Setting and retrieving models on elements
	 *  - Deal with lists of data
	 *  - Do other good stuff
	 * 
	 * Model inherits from [jQuery.Class $.Class] and make use
	 * of REST services and [http://api.jquery.com/category/deferred-object/ deferreds]
	 * so these concepts are worth exploring.  Also, 
	 * the [mvc.model Get Started with jQueryMX] has a good walkthrough of $.Model.
	 * 
	 * 
	 * ## Get and modify data from the server
	 * 
	 * $.Model makes connecting to a JSON REST service 
	 * really easy.  The following models <code>todos</code> by
	 * describing the services that can create, retrieve,
	 * update, and delete todos. 
	 * 
	 *     $.Model('Todo',{
	 *       findAll: 'GET /todos.json',
	 *       findOne: 'GET /todos/{id}.json',
	 *       create:  'POST /todos.json',
	 *       update:  'PUT /todos/{id}.json',
	 *       destroy: 'DELETE /todos/{id}.json' 
	 *     },{});
	 * 
	 * This lets you create, retrieve, update, and delete
	 * todos programatically:
	 * 
	 * __Create__
	 * 
	 * Create a todo instance and 
	 * call [jQuery.Model.prototype.save save]<code>( success, error )</code>
	 * to create the todo on the server.
	 *     
	 *     // create a todo instance
	 *     var todo = new Todo({name: "do the dishes"})
	 *     
	 *     // save it on the server
	 *     todo.save();
	 * 
	 * __Retrieve__
	 * 
	 * Retrieve a list of todos from the server with
	 * <code>findAll( params, callback( items ) )</code>: 
	 *     
	 *     Todo.findAll({}, function( todos ){
	 *     
	 *       // print out the todo names
	 *       $.each(todos, function(i, todo){
	 *         console.log( todo.name );
	 *       });
	 *     });
	 * 
	 * Retrieve a single todo from the server with
	 * <code>findOne( params, callback( item ) )</code>:
	 * 
	 *     Todo.findOne({id: 5}, function( todo ){
	 *     
	 *       // print out the todo name
	 *       console.log( todo.name );
	 *     });
	 * 
	 * __Update__
	 * 
	 * Once an item has been created on the server,
	 * you can change its properties and call
	 * <code>save</code> to update it on the server.
	 * 
	 *     // update the todos' name
	 *     todo.attr('name','Take out the trash')
	 *       
	 *     // update it on the server
	 *     todo.save()
	 *       
	 * 
	 * __Destroy__
	 * 
	 * Call [jQuery.Model.prototype.destroy destroy]<code>( success, error )</code>
	 * to delete an item on the server.
	 * 
	 *     todo.destroy()
	 * 
	 * ## Listen to changes in data
	 * 
	 * Listening to changes in data is a critical part of 
	 * the [http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller Model-View-Controller]
	 * architecture.  $.Model lets you listen to when an item is created, updated, destroyed
	 * and its properties are changed by creating [jquery.model.events events]
	 * on the Model and on instances of the model.
	 * 
	 * __Create__
	 * 
	 *     // listen for when any todo is created
	 *     Todo.bind('created', function( ev, todo ) {...})
	 *     
	 *     // listen for when a specific todo is created
	 *     var todo = new Todo({name: 'do dishes'})
	 *     todo.bind('created', function( ev ) {...})
	 *   
	 * __Update__
	 * 
	 *     // listen for when any todo is updated
	 *     Todo.bind('updated', function( ev, todo ) {...})
	 *     
	 *     // listen for when a specific todo is created
	 *     Todo.findOne({id: 6}, function( todo ) {
	 *       todo.bind('updated', function( ev ) {...})
	 *     })
	 *   
	 * __Destroy__
	 * 
	 *     // listen for when any todo is destroyed
	 *     Todo.bind('destroyed', function( ev, todo ) {...})
	 *    
	 *     // listen for when a specific todo is destroyed
	 *     todo.bind('destroyed', function( ev ) {...})
	 * 
	 * __Property Changes__
	 * 
	 *     // listen for when the name property changes
	 *     todo.bind('name', function(ev){  })
	 * 
	 * __Listening with Controller__
	 * 
	 * You should be using controller to listen to model changes like:
	 * 
	 *     $.Controller('Todos',{
	 *       "{Todo} updated" : function(Todo, ev, todo) {...}
	 *     })
	 * 
	 * 
	 * ## Setting and retrieving data on elements
	 * 
	 * Almost always, we use HTMLElements to represent
	 * data to the user.  When that data changes, we update those
	 * elements to reflect the new data.
	 * 
	 * $.Model has helper methods that make this easy.  They
	 * let you "add" a model to an element and also find
	 * all elements that have had a model "added" to them.
	 * 
	 * Consider a todo list widget
	 * that lists each todo in the page and when a todo is
	 * deleted, removes it.  
	 * 
	 * [jQuery.fn.model $.fn.model]<code>( item )</code> lets you set or read a model 
	 * instance from an element:
	 * 
	 *     Todo.findAll({}, function( todos ) {
	 *       
	 *       $.each(todos, function(todo) {
	 *         $('<li>').model(todo)
	 *                  .text(todo.name)
	 *                  .appendTo('#todos')
	 *       });
	 *     });
	 * 
	 * When a todo is deleted, get its element with
	 * <code>item.</code>[jQuery.Model.prototype.elements elements]<code>( context )</code>
	 * and remove it from the page.
	 * 
	 *     Todo.bind('destroyed', function( ev, todo ) { 
	 *       todo.elements( $('#todos') ).remove()
	 *     })
	 * 
	 * __Using EJS and $.Controller__
	 * 
	 * [jQuery.View $.View] and [jQuery.EJS EJS] makes adding model data 
	 * to elements easy.  We can implement the todos widget like the following:
	 * 
	 *     $.Controller('Todos',{
	 *       init: function(){
	 *         this.element.html('//todos/views/todos.ejs', Todo.findAll({}) ); 
	 *       },
	 *       "{Todo} destroyed": function(Todo, ev, todo) {
	 *         todo.elements( this.element ).remove()
	 *       }
	 *     })
	 * 
	 * In todos.ejs
	 * 
	 * @codestart html
	 * &lt;% for(var i =0; i &lt; todos.length; i++){ %>
	 *   &lt;li &lt;%= todos[i] %>>&lt;%= todos[i].name %>&lt;/li>
	 * &lt;% } %>
	 * @codeend
	 * 
	 * Notice how you can add a model to an element with <code>&lt;%= model %&gt;</code>
	 * 
	 * ## Lists
	 * 
	 * [jQuery.Model.List $.Model.List] lets you handle multiple model instances
	 * with ease.  A List acts just like an <code>Array</code>, but you can add special properties 
	 * to it and listen to events on it.  
	 * 
	 * <code>$.Model.List</code> has become its own plugin, read about it
	 * [jQuery.Model.List here].
	 * 
	 * ## Other Good Stuff
	 * 
	 * Model can make a lot of other common tasks much easier.
	 * 
	 * ### Type Conversion
	 * 
	 * Data from the server often needs massaging to make it more useful 
	 * for JavaScript.  A typical example is date data which is 
	 * commonly passed as
	 * a number representing the Julian date like:
	 * 
	 *     { name: 'take out trash', 
	 *       id: 1,
	 *       dueDate: 1303173531164 }
	 * 
	 * But instead, you want a JavaScript date object:
	 * 
	 *     date.attr('dueDate') //-> new Date(1303173531164)
	 *     
	 * By defining property-type pairs in [jQuery.Model.static.attributes attributes],
	 * you can have model auto-convert values from the server into more useful types:
	 * 
	 *     $.Model('Todo',{
	 *       attributes : {
	 *         dueDate: 'date'
	 *       }
	 *     },{})
	 * 
	 * ### Associations
	 * 
	 * The [jQuery.Model.static.attributes attributes] property also 
	 * supports associations. For example, todo data might come back with
	 * User data as an owner property like:
	 * 
	 *     { name: 'take out trash', 
	 *       id: 1, 
	 *       owner: { name: 'Justin', id: 3} }
	 * 
	 * To convert owner into a User model, set the owner type as the User's
	 * [jQuery.Model.static.model model]<code>( data )</code> method:
	 * 
	 *     $.Model('Todo',{
	 *       attributes : {
	 *         owner: 'User.model'
	 *       }
	 *     },{})
	 * 
	 * ### Helper Functions
	 * 
	 * Often, you need to perform repeated calculations 
	 * with a model's data.  You can create methods in the model's 
	 * prototype and they will be available on 
	 * all model instances.  
	 * 
	 * The following creates a <code>timeRemaining</code> method that
	 * returns the number of seconds left to complete the todo:
	 * 
	 *     $.Model('Todo',{
	 *     },{
	 *        timeRemaining : function(){
	 *          return new Date() - new Date(this.dueDate)
	 *        }
	 *     })
	 *     
	 *     // create a todo
	 *     var todo = new Todo({dueDate: new Date()});
	 *     
	 *     // show off timeRemaining
	 *     todo.timeRemaining() //-> Number
	 * 
	 * ### Deferreds
	 * 
	 * Model methods that make requests to the server such as:
	 * [jQuery.Model.static.findAll findAll], [jQuery.Model.static.findOne findOne], 
	 * [jQuery.Model.prototype.save save], and [jQuery.Model.prototype.destroy destroy] return a
	 * [jquery.model.deferreds deferred] that resolves to the item(s)
	 * being retrieved or modified.  
	 * 
	 * Deferreds can make a lot of asynchronous code much easier.  For example, the following
	 * waits for all users and tasks before continuing :
	 * 
	 *     $.when(Task.findAll(), User.findAll())
	 *       .then(function( tasksRes, usersRes ){ ... })
	 * 
	 * ### Validations
	 * 
	 * [jquery.model.validations Validate] your model's attributes.
	 * 
	 *     $.Model("Contact",{
	 *     init : function(){
	 *         this.validate("birthday",function(){
	 *             if(this.birthday > new Date){
	 *                 return "your birthday needs to be in the past"
	 *             }
	 *         })
	 *     }
	 *     ,{});
	 * 
	 *     
	 */
		// methods that we'll weave into model if provided
		ajaxMethods = 
		/** 
	     * @Static
	     */
		{
		create: function(str  ) {
			/**
			 * @function create
			 * Create is used to create a model instance on the server.  By implementing 
			 * create along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * API for services.  
			 * 
			 * Create is called by save to create a new instance.  If you want to be able to call save on an instance
			 * you have to implement create.
			 * 
			 * The easiest way to implement create is to just give it the url to post data to:
			 * 
			 *     $.Model("Recipe",{
			 *       create: "/recipes"
			 *     },{})
			 *     
			 * This lets you create a recipe like:
			 *  
			 *     new Recipe({name: "hot dog"}).save(function(){
			 *       this.name //this is the new recipe
			 *     }).save(callback)
			 *  
			 * You can also implement create by yourself.  You just need to call success back with
			 * an object that contains the id of the new instance and any other properties that should be
			 * set on the instance.
			 *  
			 * For example, the following code makes a request 
			 * to '/recipes.json?name=hot+dog' and gets back
			 * something that looks like:
			 *  
			 *     { 
			 *       id: 5,
			 *       createdAt: 2234234329
			 *     }
			 * 
			 * The code looks like:
			 * 
			 *     $.Model("Recipe", {
			 *       create : function(attrs, success, error){
			 *         $.post("/recipes.json",attrs, success,"json");
			 *       }
			 *     },{})
			 * 
			 * 
			 * @param {Object} attrs Attributes on the model instance
			 * @param {Function} success(attrs) the callback function, it must be called with an object 
			 * that has the id of the new instance and any other attributes the service needs to add.
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function(attrs, success, error){
				return ajax(str, attrs, success, error, fixture.call(this,"Create", "-restCreate"))
			};
		},
		update: function( str ) {
			/**
			 * @function update
			 * Update is used to update a model instance on the server.  By implementing 
			 * update along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * API for services.  
			 * 
			 * Update is called by [jQuery.Model.prototype.save] or [jQuery.Model.prototype.update] 
			 * on an existing model instance.  
			 * 
			 * The easist way to implement update is to just give it the url to put data to:
			 * 
			 *     $.Model("Recipe",{
			 *       update: "/recipes/{id}"
			 *     },{})
			 *     
			 * This lets you update a recipe like:
			 *  
			 *     // PUT /recipes/5 {name: "Hot Dog"}
			 *     Recipe.update(5, {name: "Hot Dog"},
			 *       function(){
			 *         this.name //this is the updated recipe
			 *       })
			 *  
			 * If your server doesn't use PUT, you can change it to post like:
			 * 
			 *     $.Model("Recipe",{
			 *       update: "POST /recipes/{id}"
			 *     },{})
			 * 
			 * Your server should send back an object with any new attributes the model 
			 * should have.  For example if your server udpates the "updatedAt" property, it
			 * should send back something like:
			 * 
			 *     // PUT /recipes/4 {name: "Food"} ->
			 *     {
			 *       updatedAt : "10-20-2011"
			 *     }
			 * 
			 * You can also implement create by yourself.  You just need to call success back with
			 * an object that contains any properties that should be
			 * set on the instance.
			 *  
			 * For example, the following code makes a request 
			 * to '/recipes/5.json?name=hot+dog' and gets back
			 * something that looks like:
			 *  
			 *     { 
			 *       updatedAt: "10-20-2011"
			 *     }
			 * 
			 * The code looks like:
			 * 
			 *     $.Model("Recipe", {
			 *       update : function(id, attrs, success, error){
			 *         $.post("/recipes/"+id+".json",attrs, success,"json");
			 *       }
			 *     },{})
			 * 
			 * 
			 * @param {String} id the id of the model instance
			 * @param {Object} attrs Attributes on the model instance
			 * @param {Function} success(attrs) the callback function.  It optionally accepts 
			 * an object of attribute / value pairs of property changes the client doesn't already 
			 * know about. For example, when you update a name property, the server might 
			 * update other properties as well (such as updatedAt). The server should send 
			 * these properties as the response to updates.  Passing them to success will 
			 * update the model instance with these properties.
			 * 
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function(id, attrs, success, error){
				return ajax(str, addId.call(this,attrs, id), success, error, fixture.call(this,"Update", "-restUpdate"),"put")
			}
		},
		destroy: function( str ) {
			/**
			 * @function destroy
			 * Destroy is used to remove a model instance from the server. By implementing 
			 * destroy along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * service API.
			 * 
			 * You can implement destroy with a string like:
			 * 
			 *     $.Model("Thing",{
			 *       destroy : "POST /thing/destroy/{id}"
			 *     })
			 * 
			 * Or you can implement destroy manually like:
			 * 
			 *     $.Model("Thing",{
			 *       destroy : function(id, success, error){
			 *         $.post("/thing/destroy/"+id,{}, success);
			 *       }
			 *     })
			 * 
			 * You just have to call success if the destroy was successful.
			 * 
			 * @param {String|Number} id the id of the instance you want destroyed
			 * @param {Function} success the callback function, it must be called with an object 
			 * that has the id of the new instance and any other attributes the service needs to add.
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function( id, success, error ) {
				var attrs = {};
				attrs[this.id] = id;
				return ajax(str, attrs, success, error, fixture.call(this,"Destroy", "-restDestroy") ,"delete")
			}
		},
		
		findAll: function( str ) {
			/**
			 * @function findAll
			 * FindAll is used to retrive a model instances from the server. By implementing 
			 * findAll along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * service API.
			 * findAll returns a deferred ($.Deferred)
			 * 
			 * You can implement findAll with a string:
			 * 
			 *     $.Model("Thing",{
			 *       findAll : "/things.json"
			 *     },{})
			 * 
			 * Or you can implement it yourself.  The 'dataType' attribute is used to convert a JSON array of attributes
			 * to an array of instances.  For example:
			 * 
			 *     $.Model("Thing",{
			 *       findAll : function(params, success, error){
			 *         return $.ajax({
			 *         	 url: '/things.json',
			 *           type: 'get',
			 *           dataType: 'json thing.models',
			 *           data: params,
			 *           success: success,
			 *           error: error})
			 *       }
			 *     },{})
			 * 
			 * 
			 * @param {Object} params data to refine the results.  An example might be passing {limit : 20} to
			 * limit the number of items retrieved.
			 * @param {Function} success(items) called with an array (or Model.List) of model instances.
			 * @param {Function} error
			 */
			return function(params, success, error){
				return ajax(str || this.shortName+"s.json", 
					params, 
					success, 
					error, 
					fixture.call(this,"s"),
					"get",
					"json "+this._shortName+".models");
			};
		},
		findOne: function( str ) {
			/**
			 * @function findOne
			 * FindOne is used to retrive a model instances from the server. By implementing 
			 * findOne along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * service API.
			 * 
			 * You can implement findOne with a string:
			 * 
			 *     $.Model("Thing",{
			 *       findOne : "/things/{id}.json"
			 *     },{})
			 * 
			 * Or you can implement it yourself. 
			 * 
			 *     $.Model("Thing",{
			 *       findOne : function(params, success, error){
			 *         var self = this,
			 *             id = params.id;
			 *         delete params.id;
			 *         return $.get("/things/"+id+".json",
			 *           params,
			 *           success,
			 *           "json thing.model")
			 *       }
			 *     },{})
			 * 
			 * 
			 * @param {Object} params data to refine the results. This is often something like {id: 5}.
			 * @param {Function} success(item) called with a model instance
			 * @param {Function} error
			 */
			return function(params, success, error){
				return ajax(str,
					params, 
					success,
					error, 
					fixture.call(this),
					"get",
					"json "+this._shortName+".model");
			};
		}
	};





	jQuery.Class("jQuery.Model",	{
		setup: function( superClass , stat, proto) {
			//we do not inherit attributes (or associations)
			var self=this;
			each(["attributes","associations","validations"],function(i,name){
				if (!self[name] || superClass[name] === self[name] ) {
					self[name] = {};
				}
			})

			//add missing converters and serializes
			each(["convert","serialize"],function( i, name ) {
				if ( superClass[name] != self[name] ) {
					self[name] = extend({}, superClass[name], self[name] );
				}
			});

			this._fullName = underscore(this.fullName.replace(/\./g, "_"));
			this._shortName = underscore(this.shortName);

			if ( this.fullName.substr(0, 7) == "jQuery." ) {
				return;
			}

			//add this to the collection of models
			//jQuery.Model.models[this._fullName] = this;

			if ( this.listType ) {
				this.list = new this.listType([]);
			}
			
			for(var name in ajaxMethods){
				if(typeof this[name] !== 'function'){
					this[name] = ajaxMethods[name](this[name]);
				}
			}
			
			//add ajax converters
			var converters = {},
				convertName = "* "+this._shortName+".model";
				
			converters[convertName+"s"] = this.proxy('models');
			converters[convertName] = this.proxy('model');	
			
			$.ajaxSetup({
				converters : converters
			});				
		},
		/**
		 * @attribute attributes
		 * Attributes contains a map of attribute names/types.  
		 * You can use this in conjunction with 
		 * [jQuery.Model.static.convert] to provide automatic 
		 * [jquery.model.typeconversion type conversion] (including
		 * associations).  
		 * 
		 * The following converts dueDates to JavaScript dates:
		 * 
		 * 
		 *     $.Model("Contact",{
		 *       attributes : { 
		 *         birthday : 'date'
		 *       },
		 *       convert : {
		 *         date : function(raw){
		 *           if(typeof raw == 'string'){
		 *             var matches = raw.match(/(\d+)-(\d+)-(\d+)/)
		 *             return new Date( matches[1], 
		 *                      (+matches[2])-1, 
		 *                     matches[3] )
		 *           }else if(raw instanceof Date){
		 *               return raw;
		 *           }
		 *         }
		 *       }
		 *     },{})
		 * 
		 * ## Associations
		 * 
		 * Attribute type values can also represent the name of a 
		 * function.  The most common case this is used is for
		 * associated data. 
		 * 
		 * For example, a Deliverable might have many tasks and 
		 * an owner (which is a Person).  The attributes property might
		 * look like:
		 * 
		 *     attributes : {
		 *       tasks : "App.Models.Task.models"
		 *       owner: "App.Models.Person.model"
		 *     }
		 * 
		 * This points tasks and owner properties to use 
		 * <code>Task.models</code> and <code>Person.model</code>
		 * to convert the raw data into an array of Tasks and a Person.
		 * 
		 * @demo jquery/model/pages/associations.html
		 * 
		 */
		attributes: {},
		/**
		 * $.Model.model is used as a [http://api.jquery.com/extending-ajax/#Converters Ajax converter] 
		 * to convert the response of a [jQuery.Model.static.findOne] request 
		 * into a model instance.  
		 * 
		 * You will never call this method directly.  Instead, you tell $.ajax about it in findOne:
		 * 
		 *     $.Model('Recipe',{
		 *       findOne : function(params, success, error ){
		 *         return $.ajax({
		 *           url: '/services/recipes/'+params.id+'.json',
		 *           type: 'get',
		 *           
		 *           dataType : 'json recipe.model' //LOOK HERE!
		 *         });
		 *       }
		 *     },{})
		 * 
		 * This makes the result of findOne a [http://api.jquery.com/category/deferred-object/ $.Deferred]
		 * that resolves to a model instance:
		 * 
		 *     var deferredRecipe = Recipe.findOne({id: 6});
		 *     
		 *     deferredRecipe.then(function(recipe){
		 *       console.log('I am '+recipes.description+'.');
		 *     })
		 * 
		 * ## Non-standard Services
		 * 
		 * $.jQuery.model expects data to be name-value pairs like:
		 * 
		 *     {id: 1, name : "justin"}
		 *     
		 * It can also take an object with attributes in a data, attributes, or
		 * 'shortName' property.  For a App.Models.Person model the following will  all work:
		 * 
		 *     { data : {id: 1, name : "justin"} }
		 *     
		 *     { attributes : {id: 1, name : "justin"} }
		 *     
		 *     { person : {id: 1, name : "justin"} }
		 * 
		 * 
		 * ### Overwriting Model
		 * 
		 * If your service returns data like:
		 * 
		 *     {id : 1, name: "justin", data: {foo : "bar"} }
		 *     
		 * This will confuse $.Model.model.  You will want to overwrite it to create 
		 * an instance manually:
		 * 
		 *     $.Model('Person',{
		 *       model : function(data){
		 *         return new this(data);
		 *       }
		 *     },{})
		 *     
		 * 
		 * @param {Object} attributes An object of name-value pairs or an object that has a 
		 *  data, attributes, or 'shortName' property that maps to an object of name-value pairs.
		 * @return {Model} an instance of the model
		 */
		model: function( attributes ) {
			if (!attributes ) {
				return null;
			}
			if( attributes instanceof this){
				attributes = attributes.serialize();
			}
			return new this(
				// checks for properties in an object (like rails 2.0 gives);
				isObject(attributes[this._shortName]) ||
				isObject(attributes.data) || 
				isObject(attributes.attributes) || 
				attributes);
		},
		/**
		 * $.Model.models is used as a [http://api.jquery.com/extending-ajax/#Converters Ajax converter] 
		 * to convert the response of a [jQuery.Model.static.findAll] request 
		 * into an array (or [jQuery.Model.List $.Model.List]) of model instances.  
		 * 
		 * You will never call this method directly.  Instead, you tell $.ajax about it in findAll:
		 * 
		 *     $.Model('Recipe',{
		 *       findAll : function(params, success, error ){
		 *         return $.ajax({
		 *           url: '/services/recipes.json',
		 *           type: 'get',
		 *           data: params
		 *           
		 *           dataType : 'json recipe.models' //LOOK HERE!
		 *         });
		 *       }
		 *     },{})
		 * 
		 * This makes the result of findAll a [http://api.jquery.com/category/deferred-object/ $.Deferred]
		 * that resolves to a list of model instances:
		 * 
		 *     var deferredRecipes = Recipe.findAll({});
		 *     
		 *     deferredRecipes.then(function(recipes){
		 *       console.log('I have '+recipes.length+'recipes.');
		 *     })
		 * 
		 * ## Non-standard Services
		 * 
		 * $.jQuery.models expects data to be an array of name-value pairs like:
		 * 
		 *     [{id: 1, name : "justin"},{id:2, name: "brian"}, ...]
		 *     
		 * It can also take an object with additional data about the array like:
		 * 
		 *     {
		 *       count: 15000 //how many total items there might be
		 *       data: [{id: 1, name : "justin"},{id:2, name: "brian"}, ...]
		 *     }
		 * 
		 * In this case, models will return an array of instances found in 
		 * data, but with additional properties as expandos on the array:
		 * 
		 *     var people = Person.models({
		 *       count : 1500,
		 *       data : [{id: 1, name: 'justin'}, ...]
		 *     })
		 *     people[0].name // -> justin
		 *     people.count // -> 1500
		 * 
		 * ### Overwriting Models
		 * 
		 * If your service returns data like:
		 * 
		 *     {ballers: [{name: "justin", id: 5}]}
		 * 
		 * You will want to overwrite models to pass the base models what it expects like:
		 * 
		 *     $.Model('Person',{
		 *       models : function(data){
		 *         this._super(data.ballers);
		 *       }
		 *     },{})
		 * 
		 * @param {Array} instancesRawData an array of raw name - value pairs.
		 * @return {Array} a JavaScript array of instances or a [jQuery.Model.List list] of instances
		 *  if the model list plugin has been included.
		 */
		models: function( instancesRawData ) {
			if (!instancesRawData ) {
				return null;
			}
			var res = getList(this.List),
				arr = isArray(instancesRawData),
				ml = ($.Model.List && instancesRawData instanceof $.Model.List),
				raw = arr ? instancesRawData : (ml ? instancesRawData.serialize() : instancesRawData.data),
				length = raw.length,
				i = 0;
			
			res._use_call = true; //so we don't call next function with all of these
			for (; i < length; i++ ) {
				res.push(this.model(raw[i]));
			}
			if (!arr ) { //push other stuff onto array
				for ( var prop in instancesRawData ) {
					if ( prop !== 'data' ) {
						res[prop] = instancesRawData[prop];
					}

				}
			}
			return res;
		},
		/**
		 * The name of the id field.  Defaults to 'id'. Change this if it is something different.
		 * 
		 * For example, it's common in .NET to use Id.  Your model might look like:
		 * 
		 * @codestart
		 * $.Model("Friends",{
		 *   id: "Id"
		 * },{});
		 * @codeend
		 */
		id: 'id',
		//if null, maybe treat as an array?
		/**
		 * Adds an attribute to the list of attributes for this class.
		 * @hide
		 * @param {String} property
		 * @param {String} type
		 */
		addAttr: function( property, type ) {
			var stub;

			if ( this.associations[property] ) {
				return;
			}
			
			stub = this.attributes[property] || (this.attributes[property] = type);
			return type;
		},
		// a collection of all models
		_models: {},
		/**
		 * If OpenAjax is available,
		 * publishes to OpenAjax.hub.  Always adds the shortName.event.
		 * 
		 * @codestart
		 * // publishes contact.completed
		 * Namespace.Contact.publish("completed",contact);
		 * @codeend
		 * 
		 * @param {String} event The event name to publish
		 * @param {Object} data The data to publish
		 */
		publish: function( event, data ) {
			
			if ( window.OpenAjax ) {
				OpenAjax.hub.publish(this._shortName + "." + event, data);
			}

		},
		guessType : function(){
			return "string"
		},
		/**
		 * @attribute convert
		 * @type Object
		 * An object of name-function pairs that are used to convert attributes.
		 * Check out [jQuery.Model.static.attributes] or 
		 * [jquery.model.typeconversion type conversion]
		 * for examples.
		 */
		convert: {
			"date": function( str ) {
				var type = typeof str;
				if( type === "string" ) {
					return isNaN(Date.parse(str)) ? null : Date.parse(str)
				} else if ( type === 'number') {
					return new Date(str)
				} else {
					return str
				}
			},
			"number": function( val ) {
				return parseFloat(val);
			},
			"boolean": function( val ) {
				return Boolean(val);
			},
			"default" : function(val, error, type){
				var construct = $.String.getObject(type), 
					context = window, realType;
				if(type.indexOf(".") >= 0){
					realType = type.substring(0, type.lastIndexOf("."));
					context = $.String.getObject(realType);
				}
				return typeof construct == "function" ? 
					construct.call(context, val) : val;
			}
		},
		serialize : {
			"default" : function( val, type ){
				return isObject(val) && val.serialize ? val.serialize() : val;
			}
		},
		bind: bind,
		unbind: unbind,
		_ajax: ajax
	},
	/**
	 * @Prototype
	 */
	{
		/**
		 * Setup is called when a new model instance is created.
		 * It adds default attributes, then whatever attributes
		 * are passed to the class.
		 * Setup should never be called directly.
		 * 
		 * @codestart
		 * $.Model("Recipe")
		 * var recipe = new Recipe({foo: "bar"});
		 * recipe.foo //-> "bar"
		 * recipe.attr("foo") //-> "bar"
		 * @codeend
		 * 
		 * @param {Object} attributes a hash of attributes
		 */
		setup: function( attributes ) {
			// so we know not to fire events
			this._init = true;
			this.attrs(extend({},this.constructor.defaults,attributes));
			delete this._init;
		},
		/**
		 * Sets the attributes on this instance and calls save.
		 * The instance needs to have an id.  It will use
		 * the instance class's [jQuery.Model.static.update update]
		 * method.
		 * 
		 * @codestart
		 * recipe.update({name: "chicken"}, success, error);
		 * @codeend
		 * 
		 * The model will also publish a _updated_ event with [jquery.model.events Model Events].
		 * 
		 * @param {Object} attrs the model's attributes
		 * @param {Function} success called if a successful update
		 * @param {Function} error called if there's an error
		 */
		update: function( attrs, success, error ) {
			this.attrs(attrs);
			return this.save(success, error); //on success, we should 
		},
		/**
		 * Runs the validations on this model.  You can
		 * also pass it an array of attributes to run only those attributes.
		 * It returns nothing if there are no errors, or an object
		 * of errors by attribute.
		 * 
		 * To use validations, it's suggested you use the 
		 * model/validations plugin.
		 * 
		 * @codestart
		 * $.Model("Task",{
		 *   init : function(){
		 *     this.validatePresenceOf("dueDate")
		 *   }
		 * },{});
		 * 
		 * var task = new Task(),
		 *     errors = task.errors()
		 * 
		 * errors.dueDate[0] //-> "can't be empty"
		 * @codeend
		 */
		errors: function( attrs ) {
			if ( attrs ) {
				attrs = isArray(attrs) ? attrs : makeArray(arguments);
			}
			var errors = {},
				self = this,
				addErrors = function( attr, funcs ) {
					each(funcs, function( i, func ) {
						var res = func.call(self);
						if ( res ) {
							if (!errors.hasOwnProperty(attr) ) {
								errors[attr] = [];
							}

							errors[attr].push(res);
						}

					});
				},
				validations = this.constructor.validations;

			each(attrs || validations || {}, function( attr, funcs ) {
				if ( typeof attr == 'number' ) {
					attr = funcs;
					funcs = validations[attr];
				}
				addErrors(attr, funcs || []);
			});

			for ( var attr in errors ) {
				if ( errors.hasOwnProperty(attr) ) {
					return errors;
				}
			}
			return null;
		},
		/**
		 * Gets or sets an attribute on the model using setters and 
		 * getters if available.
		 * 
		 * @codestart
		 * $.Model("Recipe")
		 * var recipe = new Recipe();
		 * recipe.attr("foo","bar")
		 * recipe.foo //-> "bar"
		 * recipe.attr("foo") //-> "bar"
		 * @codeend
		 * 
		 * ## Setters
		 * 
		 * If you add a set<i>AttributeName</i> method on your model,
		 * it will be used to set the value.  The set method is called
		 * with the value and is expected to return the converted value.
		 * 
		 * @codestart
		 * $.Model("Recipe",{
		 *   setCreatedAt : function(raw){
		 *     return Date.parse(raw)
		 *   }
		 * })
		 * var recipe = new Recipe();
		 * recipe.attr("createdAt","Dec 25, 1995")
		 * recipe.createAt //-> Date
		 * @codeend
		 * 
		 * ## Asynchronous Setters
		 * 
		 * Sometimes, you want to perform an ajax request when 
		 * you set a property.  You can do this with setters too.
		 * 
		 * To do this, your setter should return undefined and
		 * call success with the converted value.  For example:
		 * 
		 * @codestart
		 * $.Model("Recipe",{
		 *   setTitle : function(title, success, error){
		 *     $.post(
		 *       "recipe/update/"+this.id+"/title",
		 *       title,
		 *       function(){
		 *         success(title);
		 *       },
		 *       "json")
		 *   }
		 * })
		 * 
		 * recipe.attr("title","fish")
		 * @codeend
		 * 
		 * ## Events
		 * 
		 * When you use attr, it can also trigger events.  This is
		 * covered in [jQuery.Model.prototype.bind].
		 * 
		 * @param {String} attribute the attribute you want to set or get
		 * @param {String|Number|Boolean} [value] value the value you want to set.
		 * @param {Function} [success] an optional success callback.  
		 *    This gets called if the attribute was successful.
		 * @param {Function} [error] an optional success callback.  
		 *    The error function is called with validation errors.
		 */
		attr: function( attribute, value, success, error ) {
			var cap = classize(attribute),
				get = "get" + cap;
				
			if ( value !== undefined ) {
				this._setProperty(attribute, value, success, error, cap);
				return this;
			}
			return this[get] ? this[get]() : this[attribute];
		},
		
		/**
		 * Binds to events on this model instance.  Typically 
		 * you'll bind to an attribute name.  Handler will be called
		 * every time the attribute value changes.  For example:
		 * 
		 * @codestart
		 * $.Model("School")
		 * var school = new School();
		 * school.bind("address", function(ev, address){
		 *   alert('address changed to '+address);
		 * })
		 * school.attr("address","1124 Park St");
		 * @codeend
		 * 
		 * You can also bind to attribute errors.
		 * 
		 * @codestart
		 * $.Model("School",{
		 *   setName : function(name, success, error){
		 *     if(!name){
		 *        error("no name");
		 *     }
		 *     return error;
		 *   }
		 * })
		 * var school = new School();
		 * school.bind("error.name", function(ev, mess){
		 *    mess // -> "no name";
		 * })
		 * school.attr("name","");
		 * @codeend
		 * 
		 * You can also bind to created, updated, and destroyed events.
		 * 
		 * @param {String} eventType the name of the event.
		 * @param {Function} handler a function to call back when an event happens on this model.
		 * @return {model} the model instance for chaining
		 */
		bind: bind,
		/**
		 * Unbinds an event handler from this instance.
		 * Read [jQuery.Model.prototype.bind] for 
		 * more information.
		 * @param {String} eventType
		 * @param {Function} handler
		 */
		unbind: unbind,
		/**
		 * Checks if there is a set_<i>property</i> value.  If it returns true, lets it handle; otherwise
		 * saves it.
		 * @hide
		 * @param {Object} property
		 * @param {Object} value
		 */
		_setProperty: function( property, value, success, error, capitalized ) {
			// the potential setter name
			var setName = "set" + capitalized,
				//the old value
				old = this[property],
				self = this,
				errorCallback = function( errors ) {
					var stub;
					stub = error && error.call(self, errors);
					$(self).triggerHandler("error." + property, errors);
				};

			// provides getter / setters
			// 
			if ( this[setName] && 
				(value = this[setName](value, this.proxy('_updateProperty', property, value, old, success, errorCallback), errorCallback)) === undefined ) {
				return;
			}
			this._updateProperty(property, value, old, success, errorCallback);
		},
		/**
		 * Triggers events when a property has been updated
		 * @hide
		 * @param {Object} property
		 * @param {Object} value
		 * @param {Object} old
		 * @param {Object} success
		 */
		_updateProperty: function( property, value, old, success, errorCallback ) {
			var Class = this.constructor,
				val, type = Class.attributes[property] || Class.addAttr(property, Class.guessType(value)),
				//the converter
				converter = Class.convert[type] || Class.convert['default'],
				errors = null,
				prefix = "",
				global = "updated.",
				args,
				globalArgs,
				callback = success,
				list = Class.list;

			val = this[property] = (value === null ? //if the value is null or undefined
			null : // it should be null
			converter.call(Class, value, function(){}, type)  //convert it to something useful
			); //just return it
			//validate (only if not initializing, this is for performance)
			if (!this._init ) {
				errors = this.errors(property);
			}
			args = [val];
			globalArgs = [property,val, old];
			if(errors){
				prefix = global ="error.";
				callback = errorCallback;
				globalArgs.splice(1,0, errors);
				args.unshift(errors)
			}
			if (old !== val && !this._init) {
				!errors && $(this).triggerHandler(prefix + property, args);
				$(this).triggerHandler(global + "attr", globalArgs);
			}
			callback && callback.apply(this, args);

			//if this class has a global list, add / remove from the list.
			if ( property === Class.id && val !== null && list ) {
				// if we didn't have an old id, add ourselves
				if (!old ) {
					list.push(this);
				} else if ( old != val ) {
					// if our id has changed ... well this should be ok
					list.remove(old);
					list.push(this);
				}
			}

		},
		
		/**
		 * Removes an attribute from the list existing of attributes. 
		 * Each attribute is set with [jQuery.Model.prototype.attr attr].
		 * 
		 * @codestart
		 * recipe.removeAttr('name')
		 * @codeend
		 * 
		 * @param {Object} [attribute]  the attribute to remove
		 */
		removeAttr: function(attr){
			var old = this[attr],
				deleted = false,
				attrs = this.constructor.attributes;
			
			//- pop it off the object
			if(this[attr]){
				delete this[attr];
			}
			
			//- pop it off the Class attributes collection
			if(attrs[attr]){
				delete attrs[attr];
				deleted = true;
			}
			
			//- trigger the update
			if (!this._init && deleted && old) {
				$(this).triggerHandler("updated.attr", [attr, null, old]);
			}
		},
		
		/**
		 * Gets or sets a list of attributes. 
		 * Each attribute is set with [jQuery.Model.prototype.attr attr].
		 * 
		 * @codestart
		 * recipe.attrs({
		 *   name: "ice water",
		 *   instructions : "put water in a glass"
		 * })
		 * @codeend
		 * 
		 * This can be used nicely with [jquery.model.events].
		 * 
		 * @param {Object} [attributes]  if present, the list of attributes to send
		 * @return {Object} the current attributes of the model
		 */
		attrs: function( attributes ) {
			var key,
				constructor  = this.constructor,
				attrs = constructor.attributes;
			if (!attributes ) {
				attributes = {};
				for ( key in attrs ) {
					if ( attrs.hasOwnProperty(key) ) {
						attributes[key] = this.attr(key);
					}
				}
			} else {
				var idName = constructor.id;
				//always set the id last
				for ( key in attributes ) {
					if ( key != idName ) {
						this.attr(key, attributes[key]);
					}
				}
				if ( idName in attributes ) {
					this.attr(idName, attributes[idName]);
				}

			}
			return attributes;
		},
		serialize : function(){
			var Class = this.constructor,
				attrs = Class.attributes,
				type,
				converter,
				data = {},
				attr;

				attributes = {};
				
			for ( attr in attrs ) {
				if ( attrs.hasOwnProperty(attr) ) {
					type = attrs[attr];
					converter = Class.serialize[type] || Class.serialize['default'];
					data[attr] = converter( this[attr] , type );
				}
			}
			return data;
		},
		/**
		 * Returns if the instance is a new object.  This is essentially if the
		 * id is null or undefined.
		 * 
		 *     new Recipe({id: 1}).isNew() //-> false
		 * @return {Boolean} false if an id is set, true if otherwise.
		 */
		isNew: function() {
			var id = getId(this);
			return (id === undefined || id === null); //if null or undefined
		},
		/**
		 * Saves the instance if there are no errors.  
		 * If the instance is new, [jQuery.Model.static.create] is
		 * called; otherwise, [jQuery.Model.static.update] is
		 * called.
		 * 
		 * @codestart
		 * recipe.save(success, error);
		 * @codeend
		 * 
		 * If OpenAjax.hub is available, after a successful create or update, 
		 * "<i>modelName</i>.created" or "<i>modelName</i>.updated" is published.
		 * 
		 * @param {Function} [success] called if a successful save.
		 * @param {Function} [error] called if the save was not successful.
		 */
		save: function( success, error ) {
			return makeRequest(this, this.isNew()  ? 'create' : 'update' , success, error);
		},

		/**
		 * Destroys the instance by calling 
		 * [jQuery.Model.static.destroy] with the id of the instance.
		 * 
		 * @codestart
		 * recipe.destroy(success, error);
		 * @codeend
		 * 
		 * If OpenAjax.hub is available, after a successful
		 * destroy "<i>modelName</i>.destroyed" is published
		 * with the model instance.
		 * 
		 * @param {Function} [success] called if a successful destroy
		 * @param {Function} [error] called if an unsuccessful destroy
		 */
		destroy: function( success, error ) {
			return makeRequest(this, 'destroy' , success, error , 'destroyed');
		},
		

		/**
		 * Returns a unique identifier for the model instance.  For example:
		 * @codestart
		 * new Todo({id: 5}).identity() //-> 'todo_5'
		 * @codeend
		 * Typically this is used in an element's shortName property so you can find all elements
		 * for a model with [jQuery.Model.prototype.elements elements].
		 * @return {String}
		 */
		identity: function() {
			var id = getId(this), 
				constructor = this.constructor;
			return (constructor._fullName + '_' + (constructor.escapeIdentity ? encodeURIComponent(id) : id)).replace(/ /g, '_');
		},
		/**
		 * Returns elements that represent this model instance.  For this to work, your element's should
		 * us the [jQuery.Model.prototype.identity identity] function in their class name.  Example:
		 * 
		 *     <div class='todo <%= todo.identity() %>'> ... </div>
		 * 
		 * This also works if you hooked up the model:
		 * 
		 *     <div <%= todo %>> ... </div>
		 *     
		 * Typically, you'll use this as a response to a Model Event:
		 * 
		 *     "{Todo} destroyed": function(Todo, event, todo){
		 *       todo.elements(this.element).remove();
		 *     }
		 * 
		 * 
		 * @param {String|jQuery|element} context If provided, only elements inside this element
		 * that represent this model will be returned.
		 * 
		 * @return {jQuery} Returns a jQuery wrapped nodelist of elements that have this model instances
		 *  identity in their class name.
		 */
		elements: function( context ) {
			return $("." + this.identity(), context);
		},
		/**
		 * @hide
		 * Publishes to OpenAjax.hub
		 * 
		 *     $.Model('Task', {
		 *       complete : function(cb){
		 *         var self = this;
		 *         $.post('/task/'+this.id,
		 *           {complete : true},
		 *           function(){
		 *             self.attr('completed', true);
		 *             self.publish('completed');
		 *           })
		 *       }
		 *     })
		 *     
		 *     
		 * @param {String} event The event type.  The model's short name will be automatically prefixed.
		 * @param {Object} [data] if missing, uses the instance in {data: this}
		 */
		publish: function( event, data ) {
			this.constructor.publish(event, data || this);
		},
		hookup: function( el ) {
			var shortName = this.constructor._shortName,
				models = $.data(el, "models") || $.data(el, "models", {});
			$(el).addClass(shortName + " " + this.identity());
			models[shortName] = this;
		}
	});
	

	each([
	/**
	 * @function created
	 * @hide
	 * Called by save after a new instance is created.  Publishes 'created'.
	 * @param {Object} attrs
	 */
	"created",
	/**
	 * @function updated
	 * @hide
	 * Called by save after an instance is updated.  Publishes 'updated'.
	 * @param {Object} attrs
	 */
	"updated",
	/**
	 * @function destroyed
	 * @hide
	 * Called after an instance is destroyed.  
	 *   - Publishes "shortName.destroyed".
	 *   - Triggers a "destroyed" event on this model.
	 *   - Removes the model from the global list if its used.
	 * 
	 */
	"destroyed"], function( i, funcName ) {
		$.Model.prototype[funcName] = function( attrs ) {
			var stub,
				constructor = this.constructor;
			
			// remove from the list if instance is destroyed
			if ( funcName === 'destroyed' && constructor.list ) {
				constructor.list.remove(getId(this));
			}
			
			// update attributes if attributes have been passed
			stub = attrs && typeof attrs == 'object' && this.attrs(attrs.attrs ? attrs.attrs() : attrs);
			
			// call event on the instance
			$(this).triggerHandler(funcName);
			this.publish(funcName, this);
			
			// call event on the instance's Class
			$([constructor]).triggerHandler(funcName, this);
			return [this].concat(makeArray(arguments)); // return like this for this.proxy chains
		};
	});

	/**
	 *  @add jQuery.fn
	 */
	// break
	/**
	 * @function models
	 * Returns a list of models.  If the models are of the same
	 * type, and have a [jQuery.Model.List], it will return 
	 * the models wrapped with the list.
	 * 
	 * @codestart
	 * $(".recipes").models() //-> [recipe, ...]
	 * @codeend
	 * 
	 * @param {jQuery.Class} [type] if present only returns models of the provided type.
	 * @return {Array|jQuery.Model.List} returns an array of model instances that are represented by the contained elements.
	 */
	$.fn.models = function( type ) {
		//get it from the data
		var collection = [],
			kind, ret, retType;
		this.each(function() {
			each($.data(this, "models") || {}, function( name, instance ) {
				//either null or the list type shared by all classes
				kind = kind === undefined ? 
					instance.constructor.List || null : 
					(instance.constructor.List === kind ? kind : null);
				collection.push(instance);
			});
		});

		ret = getList(kind);

		ret.push.apply(ret, unique(collection));
		return ret;
	};
	/**
	 * @function model
	 * 
	 * Returns the first model instance found from [jQuery.fn.models] or
	 * sets the model instance on an element.
	 * 
	 *     //gets an instance
	 *     ".edit click" : function(el) {
	 *       el.closest('.todo').model().destroy()
	 *     },
	 *     // sets an instance
	 *     list : function(items){
	 *        var el = this.element;
	 *        $.each(item, function(item){
	 *          $('<div/>').model(item)
	 *            .appendTo(el)
	 *        })
	 *     }
	 * 
	 * @param {Object} [type] The type of model to return.  If a model instance is provided
	 * it will add the model to the element.
	 */
	$.fn.model = function( type ) {
		if ( type && type instanceof $.Model ) {
			type.hookup(this[0]);
			return this;
		} else {
			return this.models.apply(this, arguments)[0];
		}

	};
	/**
	 * @page jquery.model.services Service APIs
	 * @parent jQuery.Model
	 * 
	 * Models provide an abstract API for connecting to your Services.  
	 * By implementing static:
	 * 
	 *  - [jQuery.Model.static.findAll] 
	 *  - [jQuery.Model.static.findOne] 
	 *  - [jQuery.Model.static.create] 
	 *  - [jQuery.Model.static.update] 
	 *  - [jQuery.Model.static.destroy]
	 *  
	 * You can find more details on how to implement each method.
	 * Typically, you can just use templated service urls. But if you need to
	 * implement these methods yourself, the following
	 * is a useful quick reference:
	 * 
	 * ### create(attrs, success([attrs]), error()) -> deferred
	 *  
	 *  - <code>attrs</code> - an Object of attribute / value pairs
	 *  - <code>success([attrs])</code> - Create calls success when the request has completed 
	 *    successfully.  Success can be called back with an object that represents
	 *    additional properties that will be set on the instance. For example, the server might 
	 *    send back an updatedAt date.
	 *  - <code>error</code> - Create should callback error if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to any additional attrs
	 *    that might need to be set on the model instance.
	 * 
	 * 
	 * ### findAll( params, success(items), error) -> deferred
	 * 
	 * 
	 *  - <code>params</code> - an Object that filters the items returned
	 *  - <code>success(items)</code> - success should be called with an Array of Model instances.
	 *  - <code>error</code> - called if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to the list of items
	 *          
	 * ### findOne(params, success(items), error) -> deferred
	 *          
	 *  - <code>params</code> - an Object that filters the item returned
	 *  - <code>success(item)</code> - success should be called with a model instance.
	 *  - <code>error</code> - called if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to a model instance
	 *        
	 * ### update(id, attrs, success([attrs]), error()) -> deferred
	 *  
	 *  - <code>id</code> - the id of the instance you are updating
	 *  - <code>attrs</code> - an Object of attribute / value pairs
	 *  - <code>success([attrs])</code> - Call success when the request has completed 
	 *    successfully.  Success can be called back with an object that represents
	 *    additional properties that will be set on the instance. For example, the server might 
	 *    send back an updatedAt date.
	 *  - <code>error</code> - Callback error if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to any additional attrs
	 *      that might need to be set on the model instance.
	 *     
	 * ### destroy(id, success([attrs]), error()) -> deferred
	 *  
	 *  - <code>id</code> - the id of the instance you are destroying
	 *  - <code>success([attrs])</code> - Calls success when the request has completed 
	 *      successfully.  Success can be called back with an object that represents
	 *      additional properties that will be set on the instance. 
	 *  - <code>error</code> - Create should callback error if an error happens during the request
	 *  - <code>deferred</code> - A deferred that gets resolved to any additional attrs
	 *      that might need to be set on the model instance.
	 */
})(jQuery);

//jquery.model.backup.js

(function($){
var isArray = $.isArray,
	propCount = function(obj){
		var count = 0;
		for(var prop in obj) count++;
		return count;
	},
	same = function(a, b, deep){
		var aType = typeof a,
			aArray = isArray(a);
		if(deep === -1){
			return aType === 'object' || a === b;
		}
		if(aType !== typeof  b || aArray !== isArray(b)){
			return false;
		}
		if(a === b){
			return true;
		}
		if(aArray){
			if(a.length !== b.length){
				return false;
			}
			for(var i =0; i < a.length; i ++){
				if(!same(a[i],b[i])){
					return false;
				}
			};
			return true;
		} else if(aType === "object" || aType === 'function'){
			var count = 0;
			for(var prop in a){
				if(!same(a[prop],b[prop], deep === false ? -1 : undefined )){
					return false;
				}
				count++;
			}
			return count === propCount(b)
		} 
		return false;
	},
	flatProps = function(a){
		var obj = {};
		for(var prop in a){
			if(typeof a[prop] !== 'object' || a[prop] === null){
				obj[prop] = a[prop]
			}
		}
		return obj;
	};
/**
@page jquerymx.model.backup Backup / Restore
@parent jQuery.Model
@plugin jquery/model/backup
@test jquery/model/backup/qunit.html
@download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/backup/backup.js

You can backup and restore instance data with the jquery/model/backup
plugin.

To backup a model instance call [jQuery.Model.prototype.backup backup] like:

@codestart
var recipe = new Recipe({name: "cheese"});
recipe.backup()
@codeend

You can check if the instance is dirty with [jQuery.Model.prototype.isDirty isDirty]:

@codestart
recipe.name = 'blah'
recipe.isDirty() //-> true
@codeend

Finally, you can restore the original attributes with 
[jQuery.Model.prototype.backup backup].

@codestart
recipe.restore();
recipe.name //-> "cheese"
@codeend

See this in action:

@demo jquery/model/backup/backup.html
 */

	$.extend($.Model.prototype,{
		/**
		 * @function jQuery.Model.prototype.backup
		 * @parent jquerymx.model.backup
		 * Backs up an instance of a model, so it can be restored later.
		 * The plugin also adds an [jQuery.Model.prototype.isDirty isDirty]
		 * method for checking if it is dirty.
		 */
		backup: function() {
			this._backupStore = this.serialize();
			return this;
		},

	   /**
	    * @function jQuery.Model.prototype.isDirty
	    * @plugin jquery/model/backup
	    * @parent jquerymx.model.backup
	    * Returns if the instance needs to be saved.  This will go
	    * through associations too.
	    * @return {Boolean} true if there are changes, false if otherwise
	    */
	   isDirty: function(checkAssociations) {
			// check if it serializes the same
			if(!this._backupStore){
				return false;
			} else {
				return !same(this.serialize(), this._backupStore, !!checkAssociations);
			}
		},
		/**
		 * @function jQuery.Model.prototype.restore
		 * @parent jquery.model.backup
		 * restores this instance to its backup data.
		 * @return {model} the instance (for chaining)
		 */
		restore: function(restoreAssociations) {
			var props = restoreAssociations ? this._backupStore : flatProps(this._backupStore)
			this.attrs(props);   
			
			return this;
		}
	   
   })
})(jQuery);

//jquery.model.list.js

(function( $ ) {

	var getArgs = function( args ) {
		if ( args[0] && ($.isArray(args[0])) ) {
			return args[0]
		} else if ( args[0] instanceof $.Model.List ) {
			return $.makeArray(args[0])
		}
		else {
			return $.makeArray(args)
		}
	},
		//used for namespacing
		id = 0,
		getIds = function( item ) {
			return item[item.constructor.id]
		},
		expando = jQuery.expando,
		each = $.each,
		ajax = $.Model._ajax,

		/**
		 * @class jQuery.Model.List
		 * @parent jQuery.Model
		 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/list/list.js
		 * @test jquery/model/list/qunit.html
		 * @plugin jquery/model/list
		 * 
		 * Model.Lists manage a lists (or arrays) of 
		 * model instances.  Similar to [jQuery.Model $.Model], 
		 * they are used to:
		 * 
		 *  - create events when a list changes 
		 *  - make Ajax requests on multiple instances
		 *  - add helper function for multiple instances (ACLs)
		 * 
		 * The [todo] app demonstrates using a $.Controller to 
		 * implement an interface for a $.Model.List.
		 * 
		 * ## Creating A List Class
		 * 
		 * Create a `$.Model.List [jQuery.Class class] for a $.Model
		 * like:
		 * 
		 *     $.Model('Todo')
		 *     $.Model.List('Todo.List',{
		 *       // static properties
		 *     },{
		 *       // prototype properties
		 *     })
		 * 
		 * This creates a `Todo.List` class for the `Todo` 
		 * class. This creates some nifty magic that we will see soon.
		 * 
		 * `static` properties are typically used to describe how 
		 * a list makes requests.  `prototype` properties are 
		 * helper functions that operate on an instance of 
		 * a list. 
		 * 
		 * ## Make a Helper Function
		 * 
		 * Often, a user wants to select multiple items on a
		 * page and perform some action on them (for example, 
		 * deleting them). The app
		 * needs to indicate if this is possible (for example,
		 * by enabling a "DELETE" button).
		 * 
		 * 
		 * If we get todo data back like:
		 * 
		 *     // GET /todos.json ->
		 *     [{
		 *       "id" : 1,
		 *       "name" : "dishes",
		 *       "acl" : "rwd"
		 *     },{
		 *       "id" : 2,
		 *       "name" : "laundry",
		 *       "acl" : "r"
		 *     }, ... ]
		 * 
		 * We can add a helper function to let us know if we can 
		 * delete all the instances:
		 * 
		 *     $.Model.List('Todo.List',{
		 *     
		 *     },{
		 *        canDelete : function(){
		 *          return this.grep(function(todo){
		 *            return todo.acl.indexOf("d") != 0
		 *          }).length == this.length
		 *        }
		 *     })
		 * 
		 * `canDelete` gets a list of all todos that have
		 * __d__ in their acl.  If all todos have __d__,
		 * then `canDelete` returns true.
		 * 
		 * ## Get a List Instance
		 * 
		 * You can create a model list instance by using
		 * `new Todo.List( instances )` like:
		 * 
		 *     var todos = new Todo.List([
		 *       new Todo({id: 1, name: ...}),
		 *       new Todo({id: 2, name: ...}),
		 *     ]);
		 * 
		 * And call `canDelete` on it like:
		 * 
		 *     todos.canDelete() //-> boolean
		 * 
		 * BUT! $.Model, [jQuery.fn.models $.fn.models], and $.Model.List are designed 
		 * to work with each other.
		 * 
		 * When you use `Todo.findAll`, it will callback with an instance
		 * of `Todo.List`:
		 * 
		 *     Todo.findAll({}, function(todos){
		 *        todos.canDelete() //-> boolean
		 *     })
		 * 
		 * If you are adding the model instance to elements and
		 * retrieving them back with `$().models()`, it will 
		 * return a instance of `Todo.List`.  The following
		 * returns if the checked `.todo` elements are
		 * deletable:
		 * 
		 *     // get the checked inputs
		 *     $('.todo input:checked')
		 *        // get the todo elements
		 *        .closest('.todo')
		 *        // get the model list
		 *        .models()
		 *        // check canDelete
		 *        .canDelete()
		 * 
		 * ## Make Ajax Requests with Lists
		 * 
		 * After checking if we can delete the todos,
		 * we should delete them from the server. Like 
		 * `$.Model`, we can add a 
		 * static [jQuery.Model.List.static.destroy destroy] url:
		 * 
		 *     $.Model.List('Todo.List',{
		 *        destroy : 'POST /todos/delete'
		 *     },{
		 *        canDelete : function(){
		 *          return this.grep(function(todo){
		 *            return todo.acl.indexOf("d") != 0
		 *          }).length == this.length
		 *        }
		 *     })
		 * 
		 * 
		 * and call [jQuery.Model.List.prototype.destroy destroy] on
		 * our list.  
		 * 
		 *     // get the checked inputs
		 *     var todos = $('.todo input:checked')
		 *        // get the todo elements
		 *        .closest('.todo')
		 *        // get the model list
		 *        .models()
		 *     
		 *     if( todos.canDelete() ) {
		 *        todos.destroy()
		 *     }
		 * 
		 * By default, destroy will create an AJAX request to 
		 * delete these instances on the server, when
		 * the AJAX request is successful, the instances are removed
		 * from the list and events are dispatched.
		 * 
		 * ## Listening to events on Lists
		 * 
		 * Use [jQuery.Model.List.prototype.bind bind]`(eventName, handler(event, data))` 
		 * to listen to __add__, __remove__, and __updated__ events on a 
		 * list.  
		 * 
		 * When a model instance is destroyed, it is removed from
		 * all lists.  In the todo example, we can bind to remove to know
		 * when a todo has been destroyed.  The following 
		 * removes all the todo elements from the page when they are removed
		 * from the list:
		 * 
		 *     todos.bind('remove', function(ev, removedTodos){
		 *       removedTodos.elements().remove();
		 *     })
		 * 
		 * ## Demo
		 * 
		 * The following demo illustrates the previous features with
		 * a contacts list.  Check
		 * multiple Contacts and click "DESTROY ALL"
		 * 
		 * @demo jquery/model/list/list.html
		 * 
		 * ## Other List Features
		 * 
		 *  - Store and retrieve multiple instances
		 *  - Fast HTML inserts
		 *
		 * ### Store and retrieve multiple instances
		 * 
		 * Once you have a collection of models, you often want to retrieve and update 
		 * that list with new instances.  Storing and retrieving is a powerful feature
		 * you can leverage to manage and maintain a list of models.
		 *
		 * To store a new model instance in a list...
		 *
		 *     listInstance.push(new Animal({ type: dog, id: 123 }))
		 * 
		 * To later retrieve that instance in your list...
		 * 
		 *     var animal = listInstance.get(123);
		 *
		 * 
		 * ### Faster Inserts
		 * 
		 * The 'easy' way to add a model to an element is simply inserting
		 * the model into the view like:
		 * 
		 * @codestart xml
		 * &lt;div &lt;%= task %>> A task &lt;/div>
		 * @codeend
		 * 
		 * And then you can use [jQuery.fn.models $('.task').models()].
		 * 
		 * This pattern is fast enough for 90% of all widgets.  But it
		 * does require an extra query.  Lists help you avoid this.
		 * 
		 * The [jQuery.Model.List.prototype.get get] method takes elements and
		 * uses their className to return matched instances in the list.
		 * 
		 * To use get, your elements need to have the instance's 
		 * identity in their className.  So to setup a div to reprsent
		 * a task, you would have the following in a view:
		 * 
		 * @codestart xml
		 * &lt;div class='task &lt;%= task.identity() %>'> A task &lt;/div>
		 * @codeend
		 * 
		 * Then, with your model list, you could use get to get a list of
		 * tasks:
		 * 
		 * @codestart
		 * taskList.get($('.task'))
		 * @codeend
		 * 
		 * The following demonstrates how to use this technique:
		 * 
		 * @demo jquery/model/list/list-insert.html
		 *
		 */
		ajaxMethods =
		/**
		 * @static
		 */
		{
			update: function( str ) {
				/**
				 * @function update
				 * Update is used to update a set of model instances on the server.  By implementing 
				 * update along with the rest of the [jquery.model.services service api], your models provide an abstract
				 * API for services.  
				 * 
				 * The easist way to implement update is to just give it the url to put data to:
				 * 
				 *     $.Model.List("Recipe",{
				 *       update: "PUT /thing/update/"
				 *     },{})
				 *
				 * Or you can implement update manually like:
				 * 
				 *     $.Model.List("Thing",{
				 *       update : function(ids, attrs, success, error){
				 * 		   return $.ajax({
				 * 		   	  url: "/thing/update/",
				 * 		      success: success,
				 * 		      type: "PUT",
				 * 		      data: { ids: ids, attrs : attrs }
				 * 		      error: error
				 * 		   });
				 *       }
				 *     })
				 *     
				 * Then you update models by calling the [jQuery.Model.List.prototype.update prototype update method].
				 *
				 *     listInstance.update({ name: "Food" })
				 *
				 *
				 * By default, the request will PUT an array of ids to be updated and
				 * the changed attributes of the model instances in the body of the Ajax request.
				 *
				 *     { 
				 *         ids: [5,10,20],
				 *         attrs: { 
				 *             name: "Food" 
				 *         } 
				 *     }
				 * 
				 * Your server should send back an object with any new attributes the model 
				 * should have.  For example if your server udpates the "updatedAt" property, it
				 * should send back something like:
				 * 
				 *     // PUT /recipes/4,25,20 { name: "Food" } ->
				 *     {
				 *       updatedAt : "10-20-2011"
				 *     }
				 * 
				 * @param {Array} ids the ids of the model instance
				 * @param {Object} attrs Attributes on the model instance
				 * @param {Function} success the callback function.  It optionally accepts 
				 * an object of attribute / value pairs of property changes the client doesn't already 
				 * know about. For example, when you update a name property, the server might 
				 * update other properties as well (such as updatedAt). The server should send 
				 * these properties as the response to updates.  Passing them to success will 
				 * update the model instances with these properties.
				 * @param {Function} error a function to callback if something goes wrong.  
				 */
				return function( ids, attrs, success, error ) {
					return ajax(str, {
						ids: ids,
						attrs: attrs
					}, success, error, "-updateAll", "put")
				}
			},
			destroy: function( str ) {
				/**
				 * @function destroy
				 * Destroy is used to remove a set of model instances from the server. By implementing 
				 * destroy along with the rest of the [jquery.model.services service api], your models provide an abstract
				 * service API.
				 * 
				 * You can implement destroy with a string like:
				 * 
				 *     $.Model.List("Thing",{
				 *       destroy : "POST /thing/destroy/"
				 *     })
				 * 
				 * Or you can implement destroy manually like:
				 * 
				 *     $.Model.List("Thing",{
				 *       destroy : function(ids, success, error){
				 * 		   return $.ajax({
				 * 		   	  url: "/thing/destroy/",
				 * 		      data: ids,
				 * 		      success: success,
				 * 		      error: error,
				 * 		      type: "POST"
				 * 		   });
				 *       }
				 *     })
				 *
				 * Then you delete models by calling the [jQuery.Model.List.prototype.destroy prototype delete method].
				 *
				 *     listInstance.destroy();
				 *
				 * By default, the request will POST an array of ids to be deleted in the body of the Ajax request.
				 *
				 *     { 
				 *         ids: [5,10,20]
				 *     }
				 * 
				 * @param {Array} ids the ids of the instances you want destroyed
				 * @param {Function} success the callback function
				 * @param {Function} error a function to callback if something goes wrong.  
				 */
				return function( ids, success, error ) {
					return ajax(str, ids, success, error, "-destroyAll", "post")
				}
			}
		};

	$.Class("jQuery.Model.List", {
		setup: function() {
			for ( var name in ajaxMethods ) {
				if ( typeof this[name] !== 'function' ) {
					this[name] = ajaxMethods[name](this[name]);
				}
			}
		}
	},
	/**
	 * @Prototype
	 */
	{
		init: function( instances, noEvents ) {
			this.length = 0;
			// a cache for quick lookup by id
			this._data = {};
			//a namespace so we can remove all events bound by this list
			this._namespace = ".list" + (++id), this.push.apply(this, $.makeArray(instances || []));
		},
		/**
		 * The slice method selects a part of an array, and returns another instance of this model list's class.
		 * 
		 *     list.slice(start, end)
		 *
		 * @param {Number} start the start index to select
		 * @param {Number} end the last index to select
		 */
		slice: function() {
			return new this.Class(Array.prototype.slice.apply(this, arguments));
		},
		/**
		 * Returns a list of all instances who's property matches the given value.
		 *
		 *     list.match('candy', 'snickers')
		 * 
		 * @param {String} property the property to match
		 * @param {Object} value the value the property must equal
		 */
		match: function( property, value ) {
			return this.grep(function( inst ) {
				return inst[property] == value;
			});
		},
		/**
		 * Finds the instances of the list which satisfy a callback filter function. The original array is not affected.
		 * 
		 *     var matchedList = list.grep(function(instanceInList, indexInArray){
		 *        return instanceInList.date < new Date();
		 *     });
		 * 
		 * @param {Function} callback the function to call back.  This function has the same call pattern as what jQuery.grep provides.
		 * @param {Object} args
		 */
		grep: function( callback, args ) {
			return new this.Class($.grep(this, callback, args));
		},
		_makeData: function() {
			var data = this._data = {};
			this.each(function( i, inst ) {
				data[inst[inst.constructor.id]] = inst;
			})
		},
		/**
		 * Gets a list of elements by ID or element.
		 *
		 * To fetch by id:
		 *
		 *     var match = list.get(23);
		 *
		 * or to fetch by element:
		 * 
		 *     var match = list.get($('#content')[0])
		 * 
		 * @param {Object} args element or id to remove
		 */
		get: function() {
			if (!this.length ) {
				return new this.Class([]);
			}
			if ( this._changed ) {
				this._makeData();
			}
			var list = [],
				constructor = this[0].constructor,
				underscored = constructor._fullName,
				idName = constructor.id,
				test = new RegExp(underscored + "_([^ ]+)"),
				matches, val, args = getArgs(arguments);

			for ( var i = 0; i < args.length; i++ ) {
				if ( args[i].nodeName && (matches = args[i].className.match(test)) ) {
					val = this._data[matches[1]]
				} else {
					val = this._data[typeof args[i] == 'string' || typeof args[i] == 'number' ? args[i] : args[i][idName]]
				}
				val && list.push(val)
			}
			return new this.Class(list)
		},
		/**
		 * Removes instances from this list by id or by an element.
		 *
		 * To remove by id:
		 *
		 *     var match = list.get(23);
		 *
		 * or to remove by element:
		 * 
		 *     var match = list.get($('#content')[0])
		 *
		 * @param {Object} args element or id to remove
		 */
		remove: function( args ) {
			if (!this.length ) {
				return [];
			}
			var list = [],
				constructor = this[0].constructor,
				underscored = constructor._fullName,
				idName = constructor.id,
				test = new RegExp(underscored + "_([^ ]+)"),
				matches, val;
			args = getArgs(arguments)

			//for performance, we will go through each and splice it
			var i = 0;
			while ( i < this.length ) {
				//check 
				var inst = this[i],
					found = false
					for ( var a = 0; a < args.length; a++ ) {
						var id = (args[a].nodeName && (matches = args[a].className.match(test)) && matches[1]) || (typeof args[a] == 'string' || typeof args[a] == 'number' ? args[a] : args[a][idName]);
						if ( inst[idName] == id ) {
							list.push.apply(list, this.splice(i, 1));
							args.splice(a, 1);
							found = true;
							break;
						}
					}
					if (!found ) {
						i++;
					}
			}
			var ret = new this.Class(list);
			if ( ret.length ) {
				$([this]).trigger("remove", [ret])
			}

			return ret;
		},
		/**
		 * Returns elements that represent this list.  For this to work, your element's should
		 * us the [jQuery.Model.prototype.identity identity] function in their class name.  Example:
		 * 
		 *     <div class='todo <%= todo.identity() %>'> ... </div>
		 * 
		 * This also works if you hooked up the model:
		 * 
		 *     <div <%= todo %>> ... </div>
		 *     
		 * Typically, you'll use this as a response to a Model Event:
		 * 
		 *     "{Todo} destroyed": function(Todo, event, todo){
		 *       todo.elements(this.element).remove();
		 *     }
		 * 
		 * @param {String|jQuery|element} context If provided, only elements inside this element that represent this model will be returned.
		 * @return {jQuery} Returns a jQuery wrapped nodelist of elements that have these model instances identities in their class names.
		 */
		elements: function( context ) {
			// TODO : this can probably be done with 1 query.
			return $(
			this.map(function( item ) {
				return "." + item.identity()
			}).join(','), context);
		},
		model: function() {
			return this.constructor.namespace
		},
		/**
		 * Finds items and adds them to this list.  This uses [jQuery.Model.static.findAll]
		 * to find items with the params passed.
		 * 
		 * @param {Object} params options to refind the returned items
		 * @param {Function} success called with the list
		 * @param {Object} error
		 */
		findAll: function( params, success, error ) {
			var self = this;
			this.model().findAll(params, function( items ) {
				self.push(items);
				success && success(self)
			}, error)
		},
		/**
		 * Destroys all items in this list.  This will use the List's 
		 * [jQuery.Model.List.static.destroy static destroy] method.
		 * 
		 *     list.destroy(function(destroyedItems){
		 *         //success
		 *     }, function(){
		 *         //error
		 *     });
		 * 
		 * @param {Function} success a handler called back with the destroyed items.  The original list will be emptied.
		 * @param {Function} error a handler called back when the destroy was unsuccessful.
		 */
		destroy: function( success, error ) {
			var ids = this.map(getIds),
				items = this.slice(0, this.length);

			if ( ids.length ) {
				this.constructor.destroy(ids, function() {
					each(items, function() {
						this.destroyed();
					})
					success && success(items)
				}, error);
			} else {
				success && success(this);
			}

			return this;
		},
		/**
		 * Updates items in the list with attributes.  This makes a 
		 * request using the list class's [jQuery.Model.List.static.update static update].
		 *
		 *     list.update(function(updatedItems){
		 *         //success
		 *     }, function(){
		 *         //error
		 *     });
		 * 
		 * @param {Object} attrs attributes to update the list with.
		 * @param {Function} success a handler called back with the updated items.
		 * @param {Function} error a handler called back when the update was unsuccessful.
		 */
		update: function( attrs, success, error ) {
			var ids = this.map(getIds),
				items = this.slice(0, this.length);

			if ( ids.length ) {
				this.constructor.update(ids, attrs, function( newAttrs ) {
					// final attributes to update with
					var attributes = $.extend(attrs, newAttrs || {})
					each(items, function() {
						this.updated(attributes);
					})
					success && success(items)
				}, error);
			} else {
				success && success(this);
			}

			return this;
		},
		/**
		 * Listens for an events on this list.  The only useful events are:
		 * 
		 *   . add - when new items are added
		 *   . update - when an item is updated
		 *   . remove - when items are removed from the list (typically because they are destroyed).
		 *    
		 * ## Listen for items being added 
		 *  
		 *     list.bind('add', function(ev, newItems){
		 *     
		 *     })
		 *     
		 * ## Listen for items being removed
		 * 
		 *     list.bind('remove',function(ev, removedItems){
		 *     
		 *     })
		 *     
		 * ## Listen for an item being updated
		 * 
		 *     list.bind('update',function(ev, updatedItem){
		 *     
		 *     })
		 */
		bind: function() {
			if ( this[expando] === undefined ) {
				this.bindings(this);
				// we should probably remove destroyed models here
			}
			$.fn.bind.apply($([this]), arguments);
			return this;
		},
		/**
		 * Unbinds an event on this list.  Once all events are unbound,
		 * unbind stops listening to all elements in the collection.
		 * 
		 *     list.unbind("update") //unbinds all update events
		 */
		unbind: function() {
			$.fn.unbind.apply($([this]), arguments);
			if ( this[expando] === undefined ) {
				$(this).unbind(this._namespace)
			}
			return this;
		},
		// listens to destroyed and updated on instances so when an item is
		//  updated - updated is called on model
		//  destroyed - it is removed from the list
		bindings: function( items ) {
			var self = this;
			$(items).bind("destroyed" + this._namespace, function() {
				//remove from me
				self.remove(this); //triggers the remove event
			}).bind("updated" + this._namespace, function() {
				$([self]).trigger("updated", this)
			});
		},
		/**
		 * @function push
		 * Adds a instance or instances to the list
		 * 
		 *     list.push(new Recipe({id: 5, name: "Water"}))
		 */
		push: function() {
			var args = getArgs(arguments),
				self = this;
			//listen to events on this only if someone is listening on us, this means remove won't
			//be called if we aren't listening for removes
			if ( this[expando] !== undefined ) {
				this.bindings(args);
			}

			this._changed = true;
			var res = push.apply(this, args)
			//do this first so we could prevent?
			if ( this[expando] && args.length ) {
				$([this]).trigger("add", [args]);
			}

			return res;
		},
		serialize: function() {
			return this.map(function( item ) {
				return item.serialize()
			});
		}
	});

	var push = [].push,
		modifiers = {

			/**
			 * @function pop
			 * Removes the last instance of the list, and returns that instance.
			 *
			 *     list.pop()
			 * 
			 */
			pop: [].pop,
			/**
			 * @function shift
			 * Removes the first instance of the list, and returns that instance.
			 *
			 *     list.shift()
			 * 
			 */
			shift: [].shift,
			/**
			 * @function unshift
			 * Adds a new instance to the beginning of an array, and returns the new length.
			 *
			 *     list.unshift(element1,element2,...) 
			 *
			 */
			unshift: [].unshift,
			/**
			 * @function splice
			 * The splice method adds and/or removes instances to/from the list, and returns the removed instance(s).
			 *
			 *     list.splice(index,howmany)
			 * 
			 */
			splice: [].splice,
			/**
			 * @function sort
			 * Sorts the instances in the list.
			 *
			 *     list.sort(sortfunc)
			 * 
			 */
			sort: [].sort
		}

		each(modifiers, function( name, func ) {
			$.Model.List.prototype[name] = function() {
				this._changed = true;
				return func.apply(this, arguments);
			}
		})

		each([
		/**
		 * @function each
		 * Iterates through the list of model instances, calling the callback function on each iteration. 
		 *
		 *     list.each(function(indexInList, modelOfList){
		 *         ...
		 *     });
		 * 
		 * @param {Function} callback The function that will be executed on every object.
		 */
		'each',
		/**
		 * @function map
		 * Iterates through the list of model instances, calling the callback function on each iteration.
		 * 
		 *     list.map(function(modelOfList, indexInList){
		 *         ...
		 *     });
		 * 
		 * @param {Function} callback The function to process each item against.
		 */
		'map'], function( i, name ) {
			$.Model.List.prototype[name] = function( callback, args ) {
				return $[name](this, callback, args);
			}
		})


})(jQuery);

//jquery.model.validations.js

(function($){
/**
@page jquery.model.validations Validations
@plugin jquery/model/validations
@download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/validations/validations.js
@test jquery/model/validations/qunit.html
@parent jQuery.Model

In many apps, it's important to validate data before sending it to the server. 
The jquery/model/validations plugin provides validations on models.

## Example

To use validations, you need to call a validate method on the Model class.
The best place to do this is in a Class's init function.

@codestart
$.Model("Contact",{
	init : function(){
		// validates that birthday is in the future
		this.validate("birthday",function(){
			if(this.birthday > new Date){
				return "your birthday needs to be in the past"
			}
		})
	}
},{});
@codeend

## Demo

Click a person's name to update their birthday.  If you put the date
in the future, say the year 2525, it will report back an error.

@demo jquery/model/validations/validations.html
 */

//validations object is by property.  You can have validations that
//span properties, but this way we know which ones to run.
//  proc should return true if there's an error or the error message
var validate = function(attrNames, options, proc) {
	if(!proc){
		proc = options;
		options = {};
	}
	options = options || {};
	attrNames = $.makeArray(attrNames)
	
	if(options.testIf && !options.testIf.call(this)){
		return;
	}
	
	var self = this;
	$.each(attrNames, function(i, attrName) {
		// Call the validate proc function in the instance context
		if(!self.validations[attrName]){
			self.validations[attrName] = [];
		}
		self.validations[attrName].push(function(){
			var res = proc.call(this, this[attrName]);
			return res === undefined ? undefined : (options.message || res);
		})
	});
   
};

$.extend($.Model, {
   /**
    * @function jQuery.Model.static.validate
    * @parent jquery.model.validations
    * Validates each of the specified attributes with the given function.  See [validation] for more on validations.
    * @param {Array|String} attrNames Attribute name(s) to to validate
    * @param {Function} validateProc Function used to validate each given attribute. Returns nothing if valid and an error message otherwise. Function is called in the instance context and takes the value to validate.
    * @param {Object} options (optional) Options for the validations.  Valid options include 'message' and 'testIf'.
    */
   validate: validate,
   
   /**
    * @attribute validationMessages
    * @parent jquery.model.validations
    * The default validation error messages that will be returned by the builtin
    * validation methods. These can be overwritten by assigning new messages
    * to $.Model.validationMessages.&lt;message> in your application setup.
    * 
    * The following messages are available:
    *  * format
    *  * inclusion
    *  * lengthShort
    *  * lengthLong
    *  * presence
    *  * range
    * 
    * It is important to ensure that you steal jquery/model/validations 
    * before overwriting the messages, otherwise the changes will
    * be lost once steal loads it later.
    */
   validationMessages : {
       format      : "is invalid",
       inclusion   : "is not a valid option (perhaps out of range)",
       lengthShort : "is too short",
       lengthLong  : "is too long",
       presence    : "can't be empty",
       range       : "is out of range"
   },

   /**
    * @function jQuery.Model.static.validateFormatOf
    * @parent jquery.model.validations
    * Validates where the values of specified attributes are of the correct form by
    * matching it against the regular expression provided.  See [validation] for more on validations.
    * @param {Array|String} attrNames Attribute name(s) to to validate
    * @param {RegExp} regexp Regular expression used to match for validation
    * @param {Object} options (optional) Options for the validations.  Valid options include 'message' and 'testIf'.
    *
    */
   validateFormatOf: function(attrNames, regexp, options) {
      validate.call(this, attrNames, options, function(value) {
         if(  (typeof value != 'undefined' && value != '')
         	&& String(value).match(regexp) == null )
         {
            return this.Class.validationMessages.format;
         }
      });
   },

   /**
    * @function jQuery.Model.static.validateInclusionOf
    * @parent jquery.model.validations
    * Validates whether the values of the specified attributes are available in a particular
    * array.   See [validation] for more on validations.
    * @param {Array|String} attrNames Attribute name(s) to to validate
    * @param {Array} inArray Array of options to test for inclusion
    * @param {Object} options (optional) Options for the validations.  Valid options include 'message' and 'testIf'.
    * 
    */
   validateInclusionOf: function(attrNames, inArray, options) {
      validate.call(this, attrNames, options, function(value) {
         if(typeof value == 'undefined')
            return;

         if($.grep(inArray, function(elm) { return (elm == value);}).length == 0)
            return this.Class.validationMessages.inclusion;
      });
   },

   /**
    * @function jQuery.Model.static.validateLengthOf
    * @parent jquery.model.validations
    * Validates that the specified attributes' lengths are in the given range.  See [validation] for more on validations.
    * @param {Array|String} attrNames Attribute name(s) to to validate
    * @param {Number} min Minimum length (inclusive)
    * @param {Number} max Maximum length (inclusive)
    * @param {Object} options (optional) Options for the validations.  Valid options include 'message' and 'testIf'.
    *
    */
   validateLengthOf: function(attrNames, min, max, options) {
      validate.call(this, attrNames, options, function(value) {
         if((typeof value == 'undefined' && min > 0) || value.length < min)
            return this.Class.validationMessages.lengthShort + " (min=" + min + ")";
         else if(typeof value != 'undefined' && value.length > max)
            return this.Class.validationMessages.lengthLong + " (max=" + max + ")";
      });
   },

   /**
    * @function jQuery.Model.static.validatePresenceOf
    * @parent jquery.model.validations
    * Validates that the specified attributes are not blank.  See [validation] for more on validations.
    * @param {Array|String} attrNames Attribute name(s) to to validate
    * @param {Object} options (optional) Options for the validations.  Valid options include 'message' and 'testIf'.
    *
    */
   validatePresenceOf: function(attrNames, options) {
      validate.call(this, attrNames, options, function(value) {
         if(typeof value == 'undefined' || value == "" || value === null)
            return this.Class.validationMessages.presence;
      });
   },

   /**
    * @function jQuery.Model.static.validateRangeOf
    * @parent jquery.model.validations
    * Validates that the specified attributes are in the given numeric range.  See [validation] for more on validations.
    * @param {Array|String} attrNames Attribute name(s) to to validate
    * @param {Number} low Minimum value (inclusive)
    * @param {Number} hi Maximum value (inclusive)
    * @param {Object} options (optional) Options for the validations.  Valid options include 'message' and 'testIf'.
    *
    */
   validateRangeOf: function(attrNames, low, hi, options) {
      validate.call(this, attrNames, options, function(value) {
         if(typeof value != 'undefined' && value < low || value > hi)
            return this.Class.validationMessages.range + " [" + low + "," + hi + "]";
      });
   }
});

})(jQuery);

//jquery.event.hashchange.js

(function($){
  '$:nomunge'; // Used by YUI compressor.
  
  // Method / object references.
  var fake_onhashchange,
    jq_event_special = $.event.special,
    
    // Reused strings.
    str_location = 'location',
    str_hashchange = 'hashchange',
    str_href = 'href',
    
    // IE6/7 specifically need some special love when it comes to back-button
    // support, so let's do a little browser sniffing..
    browser = $.browser,
    mode = document.documentMode,
    is_old_ie = browser.msie && ( mode === undefined || mode < 8 ),
    
    // Does the browser support window.onhashchange? Test for IE version, since
    // IE8 incorrectly reports this when in "IE7" or "IE8 Compatibility View"!
    supports_onhashchange = 'on' + str_hashchange in window && !is_old_ie;
  
  // Get location.hash (or what you'd expect location.hash to be) sans any
  // leading #. Thanks for making this necessary, Firefox!
  function get_fragment( url ) {
    url = url || window[ str_location ][ str_href ];
    return url.replace( /^[^#]*#?(.*)$/, '$1' );
  };
  
  // Property: jQuery.hashchangeDelay
  // 
  // The numeric interval (in milliseconds) at which the <hashchange event>
  // polling loop executes. Defaults to 100.
  
  $[ str_hashchange + 'Delay' ] = 100;
  
  // Event: hashchange event
  // 
  // Fired when location.hash changes. In browsers that support it, the native
  // window.onhashchange event is used (IE8, FF3.6), otherwise a polling loop is
  // initialized, running every <jQuery.hashchangeDelay> milliseconds to see if
  // the hash has changed. In IE 6 and 7, a hidden Iframe is created to allow
  // the back button and hash-based history to work.
  // 
  // Usage:
  // 
  // > $(window).bind( 'hashchange', function(e) {
  // >   var hash = location.hash;
  // >   ...
  // > });
  // 
  // Additional Notes:
  // 
  // * The polling loop and Iframe are not created until at least one callback
  //   is actually bound to 'hashchange'.
  // * If you need the bound callback(s) to execute immediately, in cases where
  //   the page 'state' exists on page load (via bookmark or page refresh, for
  //   example) use $(window).trigger( 'hashchange' );
  // * The event can be bound before DOM ready, but since it won't be usable
  //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
  //   to bind it inside a $(document).ready() callback.
  
  jq_event_special[ str_hashchange ] = $.extend( jq_event_special[ str_hashchange ], {
    
    // Called only when the first 'hashchange' event is bound to window.
    setup: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to create our own. And we don't want to call this
      // until the user binds to the event, just in case they never do, since it
      // will create a polling loop and possibly even a hidden Iframe.
      $( fake_onhashchange.start );
    },
    
    // Called only when the last 'hashchange' event is unbound from window.
    teardown: function() {
      // If window.onhashchange is supported natively, there's nothing to do..
      if ( supports_onhashchange ) { return false; }
      
      // Otherwise, we need to stop ours (if possible).
      $( fake_onhashchange.stop );
    }
    
  });
  
  // fake_onhashchange does all the work of triggering the window.onhashchange
  // event for browsers that don't natively support it, including creating a
  // polling loop to watch for hash changes and in IE 6/7 creating a hidden
  // Iframe to enable back and forward.
  fake_onhashchange = (function(){
    var self = {},
      timeout_id,
      iframe,
      set_history,
      get_history;
    
    // Initialize. In IE 6/7, creates a hidden Iframe for history handling.
    function init(){
      // Most browsers don't need special methods here..
      set_history = get_history = function(val){ return val; };
      
      // But IE6/7 do!
      if ( is_old_ie ) {
        
        // Create hidden Iframe after the end of the body to prevent initial
        // page load from scrolling unnecessarily.
        iframe = $('<iframe src="javascript:0"/>').hide().insertAfter( 'body' )[0].contentWindow;
        
        // Get history by looking at the hidden Iframe's location.hash.
        get_history = function() {
          return get_fragment( iframe.document[ str_location ][ str_href ] );
        };
        
        // Set a new history item by opening and then closing the Iframe
        // document, *then* setting its location.hash.
        set_history = function( hash, history_hash ) {
          if ( hash !== history_hash ) {
            var doc = iframe.document;
            doc.open().close();
            doc[ str_location ].hash = '#' + hash;
          }
        };
        
        // Set initial history.
        set_history( get_fragment() );
      }
    };
    
    // Start the polling loop.
    self.start = function() {
      // Polling loop is already running!
      if ( timeout_id ) { return; }
      
      // Remember the initial hash so it doesn't get triggered immediately.
      var last_hash = get_fragment();
      
      // Initialize if not yet initialized.
      set_history || init();
      
      // This polling loop checks every $.hashchangeDelay milliseconds to see if
      // location.hash has changed, and triggers the 'hashchange' event on
      // window when necessary.
      if(!navigator.userAgent.match(/Rhino/))
	      (function loopy(){
	        var hash = get_fragment(),
	          history_hash = get_history( last_hash );
	        
	        if ( hash !== last_hash ) {
	          set_history( last_hash = hash, history_hash );
	          
	          $(window).trigger( str_hashchange );
	          
	        } else if ( history_hash !== last_hash ) {
	          window[ str_location ][ str_href ] = window[ str_location ][ str_href ].replace( /#.*/, '' ) + '#' + history_hash;
	        }
	        
	        timeout_id = setTimeout( loopy, $[ str_hashchange + 'Delay' ] );
	      })();
    };
    
    // Stop the polling loop, but only if an IE6/7 Iframe wasn't created. In
    // that case, even if there are no longer any bound event handlers, the
    // polling loop is still necessary for back/next to work at all!
    self.stop = function() {
      if ( !iframe ) {
        timeout_id && clearTimeout( timeout_id );
        timeout_id = 0;
      }
    };
    
    return self;
  })();
})(jQuery);

//jquery.event.handle.js

(function(){
	
var $event = $.event, 
	oldTrigger = $event.trigger, 
	isElement = function(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
		) || (o === window) || (o === document);
	};
$.event.trigger = function(event, data, elem, onlyHandlers){
		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			exclusive;

		if ( type.indexOf("!") >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join(".");
		event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Handle a global trigger
		if ( !elem ) {
			// TODO: Stop taunting the data cache; remove global events and always attach to document
			jQuery.each( jQuery.cache, function() {
				// internalKey variable is just used to make it easier to find
				// and potentially change this stuff later; currently it just
				// points to jQuery.expando
				var internalKey = jQuery.expando,
					internalCache = this[ internalKey ];
				if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
					jQuery.event.trigger( event, data, internalCache.handle.elem );
				}
			});
			return;
		}

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = jQuery._data( cur, "handle" );

			event.currentTarget = cur;
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Trigger an inline bound script
			if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
				event.result = false;
				event.preventDefault();
			}

			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old,
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[ type ] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ ontype ];

						if ( old ) {
							elem[ ontype ] = null;
						}

						jQuery.event.triggered = type;
						elem[ type ]();
					}
				} catch ( ieError ) {}

				if ( old ) {
					elem[ ontype ] = old;
				}

				jQuery.event.triggered = undefined;
			}
		}
		
		return event.result;
}
// a copy of $'s handle function that goes until it finds 
$.event.handle = function( event ) {
	
	event = jQuery.event.fix( event || window.event );
	// Snapshot the handlers list since a called handler may add/remove events.
	var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
		run_all = !event.exclusive && !event.namespace,
		args = Array.prototype.slice.call( arguments, 0 );

	// Use the fix-ed Event rather than the (read-only) native event
	args[0] = event;
	event.currentTarget = this;

	// JMVC CHANGED
	var oldType = event.type, 
		// run if default is included
		runDefault = event.type !== "default" && $event.special['default'] && 
			// and its not an original event
			!event.originalEvent && 
			// and its an element 
			isElement(event.target);
	if (runDefault) {
		$event.special['default'].triggerDefault(event, this, args[1]);
	}
	event.type = oldType;
	
	for ( var j = 0, l = handlers.length; j < l; j++ ) {
		var handleObj = handlers[ j ];
		if( event.firstPass ){
			event.firstPass = false;
			continue;
		}

		// Triggered event must 1) be non-exclusive and have no namespace, or
		// 2) have namespace(s) a subset or equal to those in the bound event.
		if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
			// Pass in a reference to the handler function itself
			// So that we can later remove it
			event.handler = handleObj.handler;
			event.data = handleObj.data;
			event.handleObj = handleObj;

			var ret = handleObj.handler.apply( this, args );


			if ( ret !== undefined ) {
				event.result = ret;
				if ( ret === false ) {
					event.preventDefault();
					event.stopPropagation();
				}
			}

			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}
	
	// JMVC CHANGED
	if (runDefault) {
		$event.special['default'].checkAndRunDefaults(event, this);
	}
	return event.result;
}
})(jQuery);

//jquery.event.default.js

(function($){

/**
 * @function jQuery.fn.triggerAsync
 * @plugin jquery/event/default
 * @parent jquery.event.pause
 * 
 * Triggers an event and calls success when the event has finished propagating through the DOM and preventDefault is not called.
 *
 *     $('#panel').triggerAsync('show', function() {
 *        $('#panel').show();
 *     });
 *
 * You can also provide a callback that gets called if preventDefault was called on the event:
 *
 *     $('panel').triggerAsync('show', function(){
 *         $('#panel').show();
 *     },function(){ 
 *         $('#other').addClass('error');
 *     });
 *
 * triggerAsync is design to work with the [jquery.event.pause] plugin although it is defined in _jquery/event/default_.
 * 
 * @param {String} type The type of event
 * @param {Object} data The data for the event
 * @param {Function} success a callback function which occurs upon success
 * @param {Function} prevented a callback function which occurs if preventDefault was called
 */
$.fn.triggerAsync = function(type, data, success, prevented){
	if(typeof data == 'function'){
		success = data;
		data = undefined;
	}
	
	if ( this[0] ) {
		var event = $.Event( type ),
			old = event.preventDefault;
		
		event.preventDefault = function(){
			old.apply(this, arguments);
			prevented && prevented(this)
		}
		//event._success= success;
		jQuery.event.trigger( {type: type, _success: success}, data, this[0]  );
	} else{
		success.call(this);
	}
	return this;
}
	


/**
 * @add jQuery.event.special
 */
//cache default types for performance
var types = {}, rnamespaces= /\.(.*)$/, $event = $.event;
/**
 * @attribute default
 * @parent specialevents
 * @plugin jquery/event/default
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/default/default.js
 * @test jquery/event/default/qunit.html
 * Allows you to perform default actions as a result of an event.
 * 
 * Event based APIs are a powerful way of exposing functionality of your widgets.  It also fits in 
 * quite nicely with how the DOM works.
 * 
 * 
 * Like default events in normal functions (e.g. submitting a form), synthetic default events run after
 * all event handlers have been triggered and no event handler has called
 * preventDefault or returned false.
 * 
 * To listen for a default event, just prefix the event with default.
 * 
 *     $("div").bind("default.show", function(ev){ ... });
 *     $("ul").delegate("li","default.activate", function(ev){ ... });
 * 
 * 
 * ## Example
 * 
 * Lets look at how you could build a simple tabs widget with default events.
 * First with just jQuery:
 * 
 * Default events are useful in cases where you want to provide an event based 
 * API for users of your widgets.  Users can simply listen to your synthetic events and 
 * prevent your default functionality by calling preventDefault.  
 * 
 * In the example below, the tabs widget provides a show event.  Users of the 
 * tabs widget simply listen for show, and if they wish for some reason, call preventDefault 
 * to avoid showing the tab.
 * 
 * In this case, the application developer doesn't want to show the second 
 * tab until the checkbox is checked. 
 * 
 * @demo jquery/event/default/defaultjquery.html
 * 
 * Lets see how we would build this with JavaScriptMVC:
 * 
 * @demo jquery/event/default/default.html
 */
$event.special["default"] = {
	add: function( handleObj ) {
		//save the type
		types[handleObj.namespace.replace(rnamespaces,"")] = true;
		
		//move the handler ...
		var origHandler = handleObj.handler;
		
		handleObj.origHandler = origHandler;
		handleObj.handler = function(ev, data){
			if(!ev._defaultActions) ev._defaultActions = [];
			ev._defaultActions.push({element: this, handler: origHandler, event: ev, data: data, currentTarget: ev.currentTarget})
		}
	},
	setup: function() {return true},
	triggerDefault : function(event, elem, data){
		
		var defaultGetter = jQuery.Event("default."+event.type);
			
		$.extend(defaultGetter,{
			target: elem,
			_defaultActions: event._defaultActions,
			exclusive : true
		});
		
		defaultGetter.stopPropagation();
	
		//default events only work on elements
		if(elem){
			// Event object or event type
			var type = defaultGetter.type || event, namespaces = [], exclusive;
			
			if (type.indexOf("!") >= 0) {
				// Exclusive events trigger only for the exact event (no namespaces)
				type = type.slice(0, -1);
				exclusive = true;
			}
			
			if (type.indexOf(".") >= 0) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			defaultGetter.type = type;
			defaultGetter.exclusive = exclusive;
			
			$event.handle.call(elem, defaultGetter, data);
		}
	},
	checkAndRunDefaults : function(event, elem){
		//fire if there are default actions to run && 
	    //        we have not prevented default &&
	    //        propagation has been stopped or we are at the document element
	    //        we have reached the document
		if (!event.isDefaultPrevented() &&
		    (!event.isPaused || !event.isPaused()) &&  // no paused function or it's not paused
	         event._defaultActions  &&
	        ( ( event.isPropagationStopped() ) ||
	          ( !elem.parentNode && !elem.ownerDocument ) )
	          
	        ) {			
			var origNamespace = event.namespace,
				origType = event.type,
				origLiveFired = event.liveFired;
			// put event back
			event.namespace= event.type;
			event.type = "default";
			event.liveFired = null;
			
			// call each event handler
			for(var i = 0 ; i < event._defaultActions.length; i++){
				var a  = event._defaultActions[i],
					oldHandle = event.handled;
				event.currentTarget = a.currentTarget;
				a.handler.call(a.element, event, a.data);
				event.handled = event.handled === null ? oldHandle : true;
	        }
	        
			event._defaultActions = null; //set to null so everyone else on this element ignores it
	        
			if(event._success){
				event._success(event);
			}
			
			event.namespace= origNamespace;
			event.type = origType;
			event.liveFired = origLiveFired;
			
	    }
	}
}

// overwrite trigger to allow default types
var oldTrigger = $event.trigger,
	triggerDefault = $event.special['default'].triggerDefault,
	checkAndRunDefaults = $event.special['default'].checkAndRunDefaults,
	oldData = jQuery._data;
	
$._data = function(elem, name, data){
	// always need to supply a function to call for handle
	if(!data && name === "handle"){
		var func = oldData.apply(this, arguments);
		return function(e){
			// Discard the second event of a jQuery.event.trigger() and
			// when an event is called after a page has unloaded
			return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
				jQuery.event.handle.apply( this, arguments ) :
				undefined;
		}
	}
	return oldData.apply(this, arguments)
}

$event.trigger =  function defaultTriggerer( event, data, elem, onlyHandlers){
	// Event object or event type
	var type = event.type || event,
		namespaces = [],

	// Caller can pass in an Event, Object, or just an event type string
	event = typeof event === "object" ?
		// jQuery.Event object
		event[ jQuery.expando ] ? event :
		// Object literal
		new jQuery.Event( type, event ) :
		// Just the event type (string)
		new jQuery.Event( type );
		
    event._defaultActions = []; //set depth for possibly reused events
	
	oldTrigger.call($.event, event, data, elem, onlyHandlers);
};
	
	
	
	
})(jQuery);

//jquery.lang.vector.js

(function($){
	var getSetZero = function(v){ return v !== undefined ? (this.array[0] = v) : this.array[0] },
		getSetOne = function(v){ return v !== undefined ? (this.array[1] = v) : this.array[1] }
/**
 * @class jQuery.Vector
 * @parent jquerymx.lang
 * A vector class
 * @constructor creates a new vector instance from the arguments.  Example:
 * @codestart
 * new jQuery.Vector(1,2)
 * @codeend
 * 
 */
	$.Vector = function() {
		this.update($.makeArray(arguments));
	};
	$.Vector.prototype =
	/* @Prototype*/
	{
		/**
		 * Applys the function to every item in the vector.  Returns the new vector.
		 * @param {Function} f
		 * @return {jQuery.Vector} new vector class.
		 */
		app: function( f ) {
			var i, vec, newArr = [];

			for ( i = 0; i < this.array.length; i++ ) {
				newArr.push(f(this.array[i]));
			}
			vec = new $.Vector();
			return vec.update(newArr);
		},
		/**
		 * Adds two vectors together.  Example:
		 * @codestart
		 * new Vector(1,2).plus(2,3) //-> &lt;3,5>
		 * new Vector(3,5).plus(new Vector(4,5)) //-> &lt;7,10>
		 * @codeend
		 * @return {$.Vector}
		 */
		plus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Like plus but subtracts 2 vectors
		 * @return {jQuery.Vector}
		 */
		minus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Returns the current vector if it is equal to the vector passed in.  
		 * False if otherwise.
		 * @return {jQuery.Vector}
		 */
		equals: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				if ( arr[i] != args[i] ) {
					return null;
				}
			}
			return vec.update(arr);
		},
/*
	 * Returns the 2nd value of the vector
	 * @return {Number}
	 */
		x: getSetZero,
		width: getSetZero,
		/**
		 * Returns the first value of the vector
		 * @return {Number}
		 */
		y: getSetOne,
		height: getSetOne,
		/**
		 * Same as x()
		 * @return {Number}
		 */
		top: getSetOne,
		/**
		 * same as y()
		 * @return {Number}
		 */
		left: getSetZero,
		/**
		 * returns (x,y)
		 * @return {String}
		 */
		toString: function() {
			return "(" + this.array[0] + "," + this.array[1] + ")";
		},
		/**
		 * Replaces the vectors contents
		 * @param {Object} array
		 */
		update: function( array ) {
			var i;
			if ( this.array ) {
				for ( i = 0; i < this.array.length; i++ ) {
					delete this.array[i];
				}
			}
			this.array = array;
			for ( i = 0; i < array.length; i++ ) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function() {
		if ( this.originalEvent.synthetic ) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(this.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0), this.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(this.pageX, this.pageY);
		}
	};

	$.fn.offsetv = function() {
		if ( this[0] == window ) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset();
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function( which ) {
		if ( this[0] == window || !which ) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};
})(jQuery);

//jquery.event.livehack.js

(function() {

	var event = jQuery.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		findHelper = function( events, types, callback ) {
			var t, type, typeHandlers, all, h, handle, namespaces, namespace;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];
					if (!handle.selector && (all || namespace.test(handle.namespace)) ) {
						callback(type, handle.origHandler || handle.handler);
					}
				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = $.data(el, "events"),
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}

		if ( selector ) {
			if (!events.live ) {
				return [];
			}
			live = events.live;

			for ( t = 0; t < live.length; t++ ) {
				liver = live[t];
				if ( liver.selector === selector && $.inArray(liver.origType, types) !== -1 ) {
					handlers.push(liver.origHandler || liver.handler);
				}
			}
		} else {
			// basically re-create handler's logic
			findHelper(events, types, function( type, handler ) {
				handlers.push(handler);
			});
		}
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $.data(el, "events"),
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});
		//then check straight binds
		findHelper(events, types, function( type, handler ) {
			add("", type, handler);
		});

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;
	
	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {

			var bySelector, selector = handleObj.selector || "";
			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};
})(jQuery);

//jquery.event.drag.js

(function( $ ) {
	//modify live
	//steal the live handler ....
	var bind = function( object, method ) {
		var args = Array.prototype.slice.call(arguments, 2);
		return function() {
			var args2 = [this].concat(args, $.makeArray(arguments));
			return method.apply(object, args2);
		};
	},
		event = $.event,
		clearSelection = window.getSelection ? function(){
				window.getSelection().removeAllRanges()
			} : function(){};
	// var handle = event.handle; //unused
	/**
	 * @class jQuery.Drag
	 * @parent specialevents
	 * @plugin jquery/event/drag
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/drag.js
	 * @test jquery/event/drag/qunit.html
	 * Provides drag events as a special events to jQuery.  
	 * A jQuery.Drag instance is created on a drag and passed
	 * as a parameter to the drag event callbacks.  By calling
	 * methods on the drag event, you can alter the drag's
	 * behavior.
	 * ## Drag Events
	 * 
	 * The drag plugin allows you to listen to the following events:
	 * 
	 * <ul>
	 *  <li><code>dragdown</code> - the mouse cursor is pressed down</li>
	 *  <li><code>draginit</code> - the drag motion is started</li>
	 *  <li><code>dragmove</code> - the drag is moved</li>
	 *  <li><code>dragend</code> - the drag has ended</li>
	 *  <li><code>dragover</code> - the drag is over a drop point</li>
	 *  <li><code>dragout</code> - the drag moved out of a drop point</li>
	 * </ul>
	 * 
	 * Just by binding or delegating on one of these events, you make
	 * the element dragable.  You can change the behavior of the drag
	 * by calling methods on the drag object passed to the callback.
	 * 
	 * ### Example
	 * 
	 * Here's a quick example:
	 * 
	 *     //makes the drag vertical
	 *     $(".drags").delegate("draginit", function(event, drag){
	 *       drag.vertical();
	 *     })
	 *     //gets the position of the drag and uses that to set the width
	 *     //of an element
	 *     $(".resize").delegate("dragmove",function(event, drag){
	 *       $(this).width(drag.position.left() - $(this).offset().left   )
	 *     })
	 * 
	 * ## Drag Object
	 * 
	 * <p>The drag object is passed after the event to drag 
	 * event callback functions.  By calling methods
	 * and changing the properties of the drag object,
	 * you can alter how the drag behaves.
	 * </p>
	 * <p>The drag properties and methods:</p>
	 * <ul>
	 *  <li><code>[jQuery.Drag.prototype.cancel cancel]</code> - stops the drag motion from happening</li>
	 *  <li><code>[jQuery.Drag.prototype.ghost ghost]</code> - copys the draggable and drags the cloned element</li>
	 *  <li><code>[jQuery.Drag.prototype.horizontal horizontal]</code> - limits the scroll to horizontal movement</li>
	 *  <li><code>[jQuery.Drag.prototype.location location]</code> - where the drag should be on the screen</li>
	 *  <li><code>[jQuery.Drag.prototype.mouseElementPosition mouseElementPosition]</code> - where the mouse should be on the drag</li>
	 *  <li><code>[jQuery.Drag.prototype.only only]</code> - only have drags, no drops</li>
	 *  <li><code>[jQuery.Drag.prototype.representative representative]</code> - move another element in place of this element</li>
	 *  <li><code>[jQuery.Drag.prototype.revert revert]</code> - animate the drag back to its position</li>
	 *  <li><code>[jQuery.Drag.prototype.vertical vertical]</code> - limit the drag to vertical movement</li>
	 *  <li><code>[jQuery.Drag.prototype.limit limit]</code> - limit the drag within an element (*limit plugin)</li>
	 *  <li><code>[jQuery.Drag.prototype.scrolls scrolls]</code> - scroll scrollable areas when dragging near their boundries (*scroll plugin)</li>
	 * </ul>
	 * <h2>Demo</h2>
	 * Now lets see some examples:
	 * @demo jquery/event/drag/drag.html 1000
	 * @constructor
	 * The constructor is never called directly.
	 */
	$.Drag = function() {};

	/**
	 * @Static
	 */
	$.extend($.Drag, {
		lowerName: "drag",
		current: null,
		distance: 0,
		/**
		 * Called when someone mouses down on a draggable object.
		 * Gathers all callback functions and creates a new Draggable.
		 * @hide
		 */
		mousedown: function( ev, element ) {
			var isLeftButton = ev.button === 0 || ev.button == 1;
			if (!isLeftButton || this.current ) {
				return;
			} //only allows 1 drag at a time, but in future could allow more
			//ev.preventDefault();
			//create Drag
			var drag = new $.Drag(),
				delegate = ev.liveFired || element,
				selector = ev.handleObj.selector,
				self = this;
			this.current = drag;

			drag.setup({
				element: element,
				delegate: ev.liveFired || element,
				selector: ev.handleObj.selector,
				moved: false,
				_distance: this.distance,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector),
					draginit: event.find(delegate, ["draginit"], selector),
					dragover: event.find(delegate, ["dragover"], selector),
					dragmove: event.find(delegate, ["dragmove"], selector),
					dragout: event.find(delegate, ["dragout"], selector),
					dragend: event.find(delegate, ["dragend"], selector)
				},
				destroyed: function() {
					self.current = null;
				}
			}, ev);
		}
	});
	
	/**
	 * @Prototype
	 */
	$.extend($.Drag.prototype, {
		setup: function( options, ev ) {
			$.extend(this, options);
			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove),
				mouseup = bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			this._distance = options.distance ? options.distance : 0;
			
			this.mouseStartPosition = ev.vector(); //where the mouse is located
			
			$(document).bind('mousemove', mousemove);
			$(document).bind('mouseup', mouseup);

			if (!this.callEvents('down', this.element, ev) ) {
			    this.noSelection(this.delegate);
				//this is for firefox
				clearSelection();
			}
		},
		/**
		 * Unbinds listeners and allows other drags ...
		 * @hide
		 */
		destroy: function() {
			$(document).unbind('mousemove', this._mousemove);
			$(document).unbind('mouseup', this._mouseup);
			if (!this.moved ) {
				this.event = this.element = null;
			}

            this.selection(this.delegate);
			this.destroyed();
		},
		mousemove: function( docEl, ev ) {
			if (!this.moved ) {
				var dist = Math.sqrt( Math.pow( ev.pageX - this.event.pageX, 2 ) + Math.pow( ev.pageY - this.event.pageY, 2 ));
				if(dist < this._distance){
					return false;
				}
				
				this.init(this.element, ev);
				this.moved = true;
			}

			var pointer = ev.vector();
			if ( this._start_position && this._start_position.equals(pointer) ) {
				return;
			}
			//e.preventDefault();
			this.draw(pointer, ev);
		},
		
		mouseup: function( docEl, event ) {
			//if there is a current, we should call its dragstop
			if ( this.moved ) {
				this.end(event);
			}
			this.destroy();
		},

        /**
         * noSelection method turns off text selection during a drag event.
         * This method is called by default unless a event is listening to the 'dragdown' event.
         *
         *  ## Example
         *
         *      $('div.drag').bind('dragdown', function(elm,event,drag){
         *          drag.noSelection();
         *      });
         *      
         * @param [elm] an element to prevent selection on.  Defaults to the dragable element.
         */
		noSelection: function(elm) {
            elm = elm || this.delegate
            
			document.documentElement.onselectstart = function() {
				return false;
			};
			document.documentElement.unselectable = "on";
			this.selectionDisabled = (this.selectionDisabled ? this.selectionDisabled.add(elm) : $(elm));
			this.selectionDisabled.css('-moz-user-select', '-moz-none');
		},

        /**
         * selection method turns on text selection that was previously turned off during the drag event.
         * This method is called by default in 'destroy' unless a event is listening to the 'dragdown' event.
         * 
         *  ## Example
         *
         *      $('div.drag').bind('dragdown', function(elm,event,drag){
         *          drag.noSelection();
         *      });
         */
		selection: function(elm) {
            if(this.selectionDisabled){
                document.documentElement.onselectstart = function() {};
                document.documentElement.unselectable = "off";
                this.selectionDisabled.css('-moz-user-select', '');
            }
		},

		init: function( element, event ) {
			element = $(element);
			var startElement = (this.movingElement = (this.element = $(element))); //the element that has been clicked on
			//if a mousemove has come after the click
			this._cancelled = false; //if the drag has been cancelled
			this.event = event;
			
			/**
			 * @attribute mouseElementPosition
			 * The position of start of the cursor on the element
			 */
			this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv()); //where the mouse is on the Element
			//this.callStart(element, event);
			this.callEvents('init', element, event);

			//Check what they have set and respond accordingly
			//  if they canceled
			if ( this._cancelled === true ) {
				return;
			}
			//if they set something else as the element
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();

			this.makePositioned(this.movingElement);
			this.oldZIndex = this.movingElement.css('zIndex');
			this.movingElement.css('zIndex', 1000);
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.compile(event, this);
			}
		},
		makePositioned: function( that ) {
			var style, pos = that.css('position');

			if (!pos || pos == 'static' ) {
				style = {
					position: 'relative'
				};

				if ( window.opera ) {
					style.top = '0px';
					style.left = '0px';
				}
				that.css(style);
			}
		},
		callEvents: function( type, element, event, drop ) {
			var i, cbs = this.callbacks[this.constructor.lowerName + type];
			for ( i = 0; i < cbs.length; i++ ) {
				cbs[i].call(element, event, this, drop);
			}
			return cbs.length;
		},
		/**
		 * Returns the position of the movingElement by taking its top and left.
		 * @hide
		 * @return {Vector}
		 */
		currentDelta: function() {
			return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
		},
		//draws the position of the dragmove object
		draw: function( pointer, event ) {
			// only drag if we haven't been cancelled;
			if ( this._cancelled ) {
				return;
			}
			clearSelection();
			/**
			 * @attribute location
			 * The location of where the element should be in the page.  This 
			 * takes into account the start position of the cursor on the element.
			 * 
			 * If the drag is going to be moved to an unacceptable location, you can call preventDefault in
			 * dragmove to prevent it from being moved there.
			 * 
			 *     $('.mover').bind("dragmove", function(ev, drag){
			 *       if(drag.location.top() < 100){
			 *         ev.preventDefault()
			 *       }
			 *     });
			 *     
			 * You can also set the location to where it should be on the page.
			 */
			this.location = pointer.minus(this.mouseElementPosition); // the offset between the mouse pointer and the representative that the user asked for
			// position = mouse - (dragOffset - dragTopLeft) - mousePosition
			
			// call move events
			this.move(event);
			if ( this._cancelled ) {
				return;
			}
			if (!event.isDefaultPrevented() ) {
				this.position(this.location);
			}

			//fill in
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.show(pointer, this, event);
			}
		},
		/**
		 * Sets the position of this drag.  
		 * 
		 * The limit and scroll plugins
		 * overwrite this to make sure the drag follows a particular path.
		 * 
		 * @param {jQuery.Vector} newOffsetv the position of the element (not the mouse)
		 */
		position: function( newOffsetv ) { //should draw it on the page
			var style, dragged_element_css_offset = this.currentDelta(),
				//  the drag element's current left + top css attributes
				dragged_element_position_vector = // the vector between the movingElement's page and css positions
				this.movingElement.offsetv().minus(dragged_element_css_offset); // this can be thought of as the original offset
			this.required_css_position = newOffsetv.minus(dragged_element_position_vector);

			this.offsetv = newOffsetv;
			//dragged_element vector can probably be cached.
			style = this.movingElement[0].style;
			if (!this._cancelled && !this._horizontal ) {
				style.top = this.required_css_position.top() + "px";
			}
			if (!this._cancelled && !this._vertical ) {
				style.left = this.required_css_position.left() + "px";
			}
		},
		move: function( event ) {
			this.callEvents('move', this.element, event);
		},
		over: function( event, drop ) {
			this.callEvents('over', this.element, event, drop);
		},
		out: function( event, drop ) {
			this.callEvents('out', this.element, event, drop);
		},
		/**
		 * Called on drag up
		 * @hide
		 * @param {Event} event a mouseup event signalling drag/drop has completed
		 */
		end: function( event ) {
			if ( this._cancelled ) {
				return;
			}
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.end(event, this);
			}

			this.callEvents('end', this.element, event);

			if ( this._revert ) {
				var self = this;
				this.movingElement.animate({
					top: this.startPosition.top() + "px",
					left: this.startPosition.left() + "px"
				}, function() {
					self.cleanup.apply(self, arguments);
				});
			}
			else {
				this.cleanup();
			}
			this.event = null;
		},
		/**
		 * Cleans up drag element after drag drop.
		 * @hide
		 */
		cleanup: function() {
			this.movingElement.css({
				zIndex: this.oldZIndex
			});
			if ( this.movingElement[0] !== this.element[0] && 
				!this.movingElement.has(this.element[0]).length && 
				!this.element.has(this.movingElement[0]).length ) {
				this.movingElement.css({
					display: 'none'
				});
			}
			if ( this._removeMovingElement ) {
				this.movingElement.remove();
			}

			this.movingElement = this.element = this.event = null;
		},
		/**
		 * Stops drag drop from running.
		 */
		cancel: function() {
			this._cancelled = true;
			//this.end(this.event);
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.clear(this.event.vector(), this, this.event);
			}
			this.destroy();

		},
		/**
		 * Clones the element and uses it as the moving element.
		 * @return {jQuery.fn} the ghost
		 */
		ghost: function( loc ) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position', 'absolute');
			(loc ? $(loc) : this.movingElement).after(ghost);
			ghost.width(this.movingElement.width()).height(this.movingElement.height());
			// put the ghost in the right location ...
			ghost.offset(this.movingElement.offset())
			
			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this.noSelection(ghost)
			this._removeMovingElement = true;
			return ghost;
		},
		/**
		 * Use a representative element, instead of the movingElement.
		 * @param {HTMLElement} element the element you want to actually drag
		 * @param {Number} offsetX the x position where you want your mouse on the object
		 * @param {Number} offsetY the y position where you want your mouse on the object
		 */
		representative: function( element, offsetX, offsetY ) {
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;

			var p = this.mouseStartPosition;

			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();
			this.noSelection(this.movingElement)
			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
		},
		/**
		 * Makes the movingElement go back to its original position after drop.
		 * @codestart
		 * ".handle dragend" : function( el, ev, drag ) {
		 *    drag.revert()
		 * }
		 * @codeend
		 * @param {Boolean} [val] optional, set to false if you don't want to revert.
		 */
		revert: function( val ) {
			this._revert = val === undefined ? true : val;
			return this;
		},
		/**
		 * Isolates the drag to vertical movement.
		 */
		vertical: function() {
			this._vertical = true;
			return this;
		},
		/**
		 * Isolates the drag to horizontal movement.
		 */
		horizontal: function() {
			this._horizontal = true;
			return true;
		},
		/**
		 * Respondables will not be alerted to this drag.
		 */
		only: function( only ) {
			return (this._only = (only === undefined ? true : only));
		},
		
		/**
		 * Sets the distance from the mouse before the item begins dragging.
		 * @param {Number} val
		 */
		distance:function(val){
			if(val !== undefined){
				this._distance = val;
				return this;
			}else{
				return this._distance
			}
		}
	});

	/**
	 * @add jQuery.event.special
	 */
	event.setupHelper([
	/**
	 * @attribute dragdown
	 * <p>Listens for when a drag movement has started on a mousedown.
	 * If you listen to this, the mousedown's default event (preventing
	 * text selection) is not prevented.  You are responsible for calling it
	 * if you want it (you probably do).  </p>
	 * <p><b>Why might you not want it?</b></p>
	 * <p>You might want it if you want to allow text selection on element
	 * within the drag element.  Typically these are input elements.</p>
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 * @codestart
	 * $(".handles").delegate("dragdown", function(ev, drag){})
	 * @codeend
	 */
	'dragdown',
	/**
	 * @attribute draginit
	 * Called when the drag starts.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'draginit',
	/**
	 * @attribute dragover
	 * Called when the drag is over a drop.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragover',
	/**
	 * @attribute dragmove
	 * Called when the drag is moved.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragmove',
	/**
	 * @attribute dragout
	 * When the drag leaves a drop point.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragout',
	/**
	 * @attribute dragend
	 * Called when the drag is done.
	 * <p>Drag events are covered in more detail in [jQuery.Drag].</p>
	 */
	'dragend'], "mousedown", function( e ) {
		$.Drag.mousedown.call($.Drag, e, this);

	});
})(jQuery);

//jquery.dom.js



//jquery.dom.cur_styles.js

(function( $ ) {

	var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
		rupper = /([A-Z])/g,
		rdashAlpha = /-([a-z])/ig,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		},
		getStyle = function( elem ) {
			if ( getComputedStyle ) {
				return getComputedStyle(elem, null);
			}
			else if ( elem.currentStyle ) {
				return elem.currentStyle;
			}
		},
		rfloat = /float/i,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/;
	/**
	 * @add jQuery
	 */
	//
	/**
	 * @function curStyles
	 * @param {HTMLElement} el
	 * @param {Array} styles An array of style names like <code>['marginTop','borderLeft']</code>
	 * @return {Object} an object of style:value pairs.  Style names are camelCase.
	 */
	$.curStyles = function( el, styles ) {
		if (!el ) {
			return null;
		}
		var currentS = getStyle(el),
			oldName, val, style = el.style,
			results = {},
			i = 0,
			left, rsLeft, camelCase, name;

		for (; i < styles.length; i++ ) {
			name = styles[i];
			oldName = name.replace(rdashAlpha, fcamelCase);

			if ( rfloat.test(name) ) {
				name = jQuery.support.cssFloat ? "float" : "styleFloat";
				oldName = "cssFloat";
			}

			if ( getComputedStyle ) {
				name = name.replace(rupper, "-$1").toLowerCase();
				val = currentS.getPropertyValue(name);
				if ( name === "opacity" && val === "" ) {
					val = "1";
				}
				results[oldName] = val;
			} else {
				camelCase = name.replace(rdashAlpha, fcamelCase);
				results[oldName] = currentS[name] || currentS[camelCase];


				if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName]) ) { //convert to px
					// Remember the original values
					left = style.left;
					rsLeft = el.runtimeStyle.left;

					// Put in the new values to get a computed value out
					el.runtimeStyle.left = el.currentStyle.left;
					style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
					results[oldName] = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					el.runtimeStyle.left = rsLeft;
				}

			}
		}

		return results;
	};
	/**
	 *  @add jQuery.fn
	 */


	$.fn
	/**
	 * @parent dom
	 * @plugin jquery/dom/cur_styles
	 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/cur_styles/cur_styles.js
	 * @test jquery/dom/cur_styles/qunit.html
	 * Use curStyles to rapidly get a bunch of computed styles from an element.
	 * <h3>Quick Example</h3>
	 * @codestart
	 * $("#foo").curStyles('float','display') //->
	 * // {
	 * //  cssFloat: "left", display: "block"
	 * // }
	 * @codeend
	 * <h2>Use</h2>
	 * <p>An element's <b>computed</b> style is the current calculated style of the property.
	 * This is different than the values on <code>element.style</code> as
	 * <code>element.style</code> doesn't reflect styles provided by css or the browser's default
	 * css properties.</p>
	 * <p>Getting computed values individually is expensive! This plugin lets you get all
	 * the style properties you need all at once.</p>
	 * <h2>Demo</h2>
	 * <p>The following demo illustrates the performance improvement curStyle provides by providing
	 * a faster 'height' jQuery function called 'fastHeight'.</p>
	 * @demo jquery/dom/cur_styles/cur_styles.html
	 * @param {String} style pass style names as arguments
	 * @return {Object} an object of style:value pairs
	 */
	.curStyles = function() {
		return $.curStyles(this[0], $.makeArray(arguments));
	};
})(jQuery);

//jquery.event.drag.limit.js

(function( $ ) {


	$.Drag.prototype
	/**
	 * @function limit
	 * @plugin jquery/event/drag/limit
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/event/drag/limit/limit.js
	 * limits the drag to a containing element
	 * @param {jQuery} container
	 * @param {Object} [center] can set the limit to the center of the object.  Can be 
	 *   'x', 'y' or 'both'
	 * @return {$.Drag}
	 */
	.limit = function( container, center ) {
		//on draws ... make sure this happens
		var styles = container.curStyles('borderTopWidth', 'paddingTop', 'borderLeftWidth', 'paddingLeft'),
			paddingBorder = new $.Vector(
			parseInt(styles.borderLeftWidth, 10) + parseInt(styles.paddingLeft, 10) || 0, parseInt(styles.borderTopWidth, 10) + parseInt(styles.paddingTop, 10) || 0);

		this._limit = {
			offset: container.offsetv().plus(paddingBorder),
			size: container.dimensionsv(),
			center : center === true ? 'both' : center
		};
		return this;
	};

	var oldPosition = $.Drag.prototype.position;
	$.Drag.prototype.position = function( offsetPositionv ) {
		//adjust required_css_position accordingly
		if ( this._limit ) {
			var limit = this._limit,
				center = limit.center && limit.center.toLowerCase(),
				movingSize = this.movingElement.dimensionsv('outer'),
				halfHeight = center && center != 'x' ? movingSize.height() / 2 : 0,
				halfWidth = center && center != 'y' ? movingSize.width() / 2 : 0,
				lot = limit.offset.top(),
				lof = limit.offset.left(),
				height = limit.size.height(),
				width = limit.size.width();

			//check if we are out of bounds ...
			//above
			if ( offsetPositionv.top()+halfHeight < lot ) {
				offsetPositionv.top(lot - halfHeight);
			}
			//below
			if ( offsetPositionv.top() + movingSize.height() - halfHeight > lot + height ) {
				offsetPositionv.top(lot + height - movingSize.height() + halfHeight);
			}
			//left
			if ( offsetPositionv.left()+halfWidth < lof ) {
				offsetPositionv.left(lof - halfWidth);
			}
			//right
			if ( offsetPositionv.left() + movingSize.width() -halfWidth > lof + width ) {
				offsetPositionv.left(lof + width - movingSize.left()+halfWidth);
			}
		}

		oldPosition.call(this, offsetPositionv);
	};

})(jQuery);

//jquery.dom.within.js

(function($){
   var withinBox = function(x, y, left, top, width, height ){
        return (y >= top &&
                y <  top + height &&
                x >= left &&
                x <  left + width);
    } 
/**
 * @function within
 * @parent dom
 * @plugin jquery/dom/within
 * 
 * Returns the elements are within the position.
 * 
 *     // get all elements that touch 200x200.
 *     $('*').within(200, 200);
 * 
 * @param {Number} left the position from the left of the page 
 * @param {Number} top the position from the top of the page
 * @param {Boolean} [useOffsetCache] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.within= function(left, top, useOffsetCache) {
    var ret = []
    this.each(function(){
        var q = jQuery(this);

        if (this == document.documentElement) {
			return ret.push(this);
		}
        var offset = useOffsetCache ? 
						jQuery.data(this,"offsetCache") || jQuery.data(this,"offsetCache", q.offset()) : 
						q.offset();

        var res =  withinBox(left, top,  offset.left, offset.top,
                                    this.offsetWidth, this.offsetHeight );

        if (res) {
			ret.push(this);
		}
    });
    
    return this.pushStack( jQuery.unique( ret ), "within", left+","+top );
}


/**
 * @function withinBox
 * @parent jQuery.fn.within
 * returns if elements are within the box
 * @param {Object} left
 * @param {Object} top
 * @param {Object} width
 * @param {Object} height
 * @param {Object} cache
 */
$.fn.withinBox = function(left, top, width, height, cache){
  	var ret = []
    this.each(function(){
        var q = jQuery(this);

        if(this == document.documentElement) return  this.ret.push(this);

        var offset = cache ? jQuery.data(this,"offset", q.offset()) : q.offset();

        var ew = q.width(), eh = q.height();

		res =  !( (offset.top > top+height) || (offset.top +eh < top) || (offset.left > left+width ) || (offset.left+ew < left));

        if(res)
            ret.push(this);
    });
    return this.pushStack( jQuery.unique( ret ), "withinBox", jQuery.makeArray(arguments).join(",") );
}
    
})(jQuery);

//jquery.dom.compare.js

(function($){
/**
 * @function compare
 * @parent dom
 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/compare/compare.js 
 * 
 * Compares the position of two nodes and returns a bitmask detailing how they are positioned 
 * relative to each other.  
 * 
 *     $('#foo').compare($('#bar')) //-> Number
 * 
 * You can expect it to return the same results as 
 * [http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition | compareDocumentPosition].
 * Parts of this documentation and source come from [http://ejohn.org/blog/comparing-document-position | John Resig].
 * 
 * ## Demo
 * @demo jquery/dom/compare/compare.html
 * @test jquery/dom/compare/qunit.html
 * @plugin dom/compare
 * 
 * 
 * @param {HTMLElement|jQuery}  element an element or jQuery collection to compare against.
 * @return {Number} A bitmap number representing how the elements are positioned from each other.
 * 
 * If the code looks like:
 * 
 *     $('#foo').compare($('#bar')) //-> Number
 * 
 * Number is a bitmap with with the following values:
 * <table class='options'>
 *     <tr><th>Bits</th><th>Number</th><th>Meaning</th></tr>
 *     <tr><td>000000</td><td>0</td><td>Elements are identical.</td></tr>
 *     <tr><td>000001</td><td>1</td><td>The nodes are in different 
 *     				documents (or one is outside of a document).</td></tr>
 *     <tr><td>000010</td><td>2</td><td>#bar precedes #foo.</td></tr>
 *     <tr><td>000100</td><td>4</td><td>#foo precedes #bar.</td></tr>
 *     <tr><td>001000</td><td>8</td><td>#bar contains #foo.</td></tr>
 *     <tr><td>010000</td><td>16</td><td>#foo contains #bar.</td></tr>
 * </table>
 */
jQuery.fn.compare = function(element){ //usually 
	//element is usually a relatedTarget, but element/c it is we have to avoid a few FF errors
	
	try{ //FF3 freaks out with XUL
		element = element.jquery ? element[0] : element;
	}catch(e){
		return null;
	}
	if (window.HTMLElement) { //make sure we aren't coming from XUL element

		var s = HTMLElement.prototype.toString.call(element)
		if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
			return null;
		}

	}
	if(this[0].compareDocumentPosition){
		return this[0].compareDocumentPosition(element);
	}
	if(this[0] == document && element != document) return 8;
	var number = (this[0] !== element && this[0].contains(element) && 16) + (this[0] != element && element.contains(this[0]) && 8),
		docEl = document.documentElement;
	if(this[0].sourceIndex){
		number += (this[0].sourceIndex < element.sourceIndex && 4)
		number += (this[0].sourceIndex > element.sourceIndex && 2)
		number += (this[0].ownerDocument !== element.ownerDocument ||
			(this[0] != docEl && this[0].sourceIndex <= 0 ) ||
			(element != docEl && element.sourceIndex <= 0 )) && 1
	}else{
		var range = document.createRange(), 
			sourceRange = document.createRange(),
			compare;
		range.selectNode(this[0]);
		sourceRange.selectNode(element);
		compare = range.compareBoundaryPoints(Range.START_TO_START, sourceRange);
		
	}

	return number;
}

})(jQuery);

//jquery.event.drop.js

(function($){
	var event = $.event, 
		callHanders = function(){
			
		};
	//somehow need to keep track of elements with selectors on them.  When element is removed, somehow we need to know that
	//
	/**
	 * @add jQuery.event.special
	 */
	var eventNames = [
	/**
	 * @attribute dropover
	 * Called when a drag is first moved over this drop element.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropover",
	/**
	 * @attribute dropon
	 * Called when a drag is dropped on a drop element.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropon",
	/**
	 * @attribute dropout
	 * Called when a drag is moved out of this drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropout",
	/**
	 * @attribute dropinit
	 * Called when a drag motion starts and the drop elements are initialized.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropinit",
	/**
	 * @attribute dropmove
	 * Called repeatedly when a drag is moved over a drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropmove",
	/**
	 * @attribute dropend
	 * Called when the drag is done for this drop.
	 * <p>Drop events are covered in more detail in [jQuery.Drop].</p>
	 */
	"dropend"];
	
	
	
	/**
	 * @class jQuery.Drop
	 * @parent specialevents
	 * @plugin jquery/event/drop
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drop/drop.js
	 * @test jquery/event/drag/qunit.html
	 * 
	 * Provides drop events as a special event to jQuery.  
	 * By binding to a drop event, the your callback functions will be 
	 * called during the corresponding phase of drag.
	 * <h2>Drop Events</h2>
	 * All drop events are called with the native event, an instance of drop, and the drag.  Here are the available drop 
	 * events:
	 * <ul>
	 * 	<li><code>dropinit</code> - the drag motion is started, drop positions are calculated.</li>
	 *  <li><code>dropover</code> - a drag moves over a drop element, called once as the drop is dragged over the element.</li>
	 *  <li><code>dropout</code> - a drag moves out of the drop element.</li>
	 *  <li><code>dropmove</code> - a drag is moved over a drop element, called repeatedly as the element is moved.</li>
	 *  <li><code>dropon</code> - a drag is released over a drop element.</li>
	 *  <li><code>dropend</code> - the drag motion has completed.</li>
	 * </ul>
	 * <h2>Examples</h2>
	 * Here's how to listen for when a drag moves over a drop:
	 * @codestart
	 * $('.drop').delegate("dropover", function(ev, drop, drag){
	 *   $(this).addClass("drop-over")
	 * })
	 * @codeend
	 * A bit more complex example:
	 * @demo jquery/event/drop/drop.html 1000
	 * 
	 * 
	 * 
	 * ## How it works
	 * 
	 *   1. When you bind on a drop event, it adds that element to the list of rootElements.
	 *      RootElements might be drop points, or might have delegated drop points in them.
	 * 
	 *   2. When a drag motion is started, each rootElement is queried for the events listening on it.
	 *      These events might be delegated events so we need to query for the drop elements.
	 *   
	 *   3. With each drop element, we add a Drop object with all the callbacks for that element.
	 *      Each element might have multiple event provided by different rootElements.  We merge
	 *      callbacks into the Drop object if there is an existing Drop object.
	 *      
	 *   4. Once Drop objects have been added to all elements, we go through them and call draginit
	 *      if available.
	 *      
	 * 
	 * @constructor
	 * The constructor is never called directly.
	 */
	$.Drop = function(callbacks, element){
		jQuery.extend(this,callbacks);
		this.element = $(element);
	}
	// add the elements ...
	$.each(eventNames, function(){
			event.special[this] = {
				add: function( handleObj ) {
					//add this element to the compiles list
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current+1   )
					if(current==0){
						$.Drop.addElement(this);
					}
				},
				remove: function() {
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current-1   )
					if(current<=1){
						$.Drop.removeElement(this);
					}
				}
			}
	});
	
	$.extend($.Drop,{
		lowerName: "drop",
		_rootElements: [], //elements that are listening for drops
		_elements: $(),    //elements that can be dropped on
		last_active: [],
		endName: "dropon",
		// adds an element as a 'root' element
		// this element might have events that we need to respond to
		addElement: function( el ) {
			//check other elements
			for(var i =0; i < this._rootElements.length ; i++  ){
				if(el ==this._rootElements[i]) return;
			}
			this._rootElements.push(el);
		},
		removeElement: function( el ) {
			 for(var i =0; i < this._rootElements.length ; i++  ){
				if(el == this._rootElements[i]){
					this._rootElements.splice(i,1)
					return;
				}
			}
		},
		/**
		* @hide
		* For a list of affected drops, sorts them by which is deepest in the DOM first.
		*/ 
		sortByDeepestChild: function( a, b ) {
			var compare = a.element.compare(b.element);
			if(compare & 16 || compare & 4) return 1;
			if(compare & 8 || compare & 2) return -1;
			return 0;
		},
		/**
		 * @hide
		 * Tests if a drop is within the point.
		 */
		isAffected: function( point, moveable, responder ) {
			return ((responder.element != moveable.element) && (responder.element.within(point[0], point[1], responder._cache).length == 1));
		},
		/**
		 * @hide
		 * Calls dropout and sets last active to null
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		deactivate: function( responder, mover, event ) {
			mover.out(event, responder)
			responder.callHandlers(this.lowerName+'out',responder.element[0], event, mover)
		}, 
		/**
		 * @hide
		 * Calls dropover
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		activate: function( responder, mover, event ) { //this is where we should call over
			mover.over(event, responder)
			//this.last_active = responder;
			responder.callHandlers(this.lowerName+'over',responder.element[0], event, mover);
		},
		move: function( responder, mover, event ) {
			responder.callHandlers(this.lowerName+'move',responder.element[0], event, mover)
		},
		/**
		 * Gets all elements that are droppable and adds them to a list.
		 * 
		 * This should be called if and when new drops are added to the page
		 * during the motion of a single drag.
		 * 
		 * This is called by default when a drag motion starts.
		 * 
		 * ## Use
		 * 
		 * After adding an element or drop, call compile.
		 * 
		 * $("#midpoint").bind("dropover",function(){
		 * 		// when a drop hovers over midpoint,
		 *      // make drop a drop.
		 * 		$("#drop").bind("dropover", function(){
		 * 			
		 * 		});
		 * 		$.Drop.compile();
		 * 	});
		 */
		compile: function( event, drag ) {
			// if we called compile w/o a current drag
			if(!this.dragging && !drag){
				return;
			}else if(!this.dragging){
				this.dragging = drag;
				this.last_active = [];
				//this._elements = $();
			}
			var el, 
				drops, 
				selector, 
				dropResponders, 
				newEls = [],
				dragging = this.dragging;
			
			// go to each root element and look for drop elements
			for(var i=0; i < this._rootElements.length; i++){ //for each element
				el = this._rootElements[i]
				
				// gets something like {"": ["dropinit"], ".foo" : ["dropover","dropmove"] }
				var drops = $.event.findBySelector(el, eventNames)

				// get drop elements by selector
				for(selector in drops){ 
					
					
					dropResponders = selector ? jQuery(selector, el) : [el];
					
					// for each drop element
					for(var e= 0; e < dropResponders.length; e++){ 
						
						// add the callbacks to the element's Data
						// there already might be data, so we merge it
						if( this.addCallbacks(dropResponders[e], drops[selector], dragging) ){
							newEls.push(dropResponders[e])
						};
					}
				}
			}
			// once all callbacks are added, call init on everything ...
			// todo ... init could be called more than once?
			this.add(newEls, event, dragging)
		},
		// adds the drag callbacks object to the element or merges other callbacks ...
		// returns true or false if the element is new ...
		// onlyNew lets only new elements add themselves
		addCallbacks : function(el, callbacks, onlyNew){
			
			var origData = $.data(el,"_dropData");
			if(!origData){
				$.data(el,"_dropData", new $.Drop(callbacks, el));
				//this._elements.push(el);
				return true;
			}else if(!onlyNew){
				var origCbs = origData;
				// merge data
				for(var eventName in callbacks){
					origCbs[eventName] = origCbs[eventName] ?
							origCbs[eventName].concat(callbacks[eventName]) :
							callbacks[eventName];
				}
				return false;
			}
		},
		// calls init on each element's drags. 
		// if its cancelled it's removed
		// adds to the current elements ...
		add: function( newEls, event, drag , dragging) {
			var i = 0,
				drop;
			
			while(i < newEls.length){
				drop = $.data(newEls[i],"_dropData");
				drop.callHandlers(this.lowerName+'init', newEls[i], event, drag)
				if(drop._canceled){
					newEls.splice(i,1)
				}else{
					i++;
				}
			}
			this._elements.push.apply(this._elements, newEls)
		},
		show: function( point, moveable, event ) {
			var element = moveable.element;
			if(!this._elements.length) return;
			
			var respondable, 
				affected = [], 
				propagate = true, 
				i = 0, 
				j, 
				la, 
				toBeActivated, 
				aff, 
				oldLastActive = this.last_active,
				responders = [],
				self = this,
				drag;
				
			//what's still affected ... we can also move element out here
			while( i < this._elements.length){
				drag = $.data(this._elements[i],"_dropData");
				
				if (!drag) {
					this._elements.splice(i, 1)
				}
				else {
					i++;
					if (self.isAffected(point, moveable, drag)) {
						affected.push(drag);
					}
				}
			}
			

			
			affected.sort(this.sortByDeepestChild); //we should only trigger on lowest children
			event.stopRespondPropagate = function(){
				propagate = false;
			}
			
			toBeActivated = affected.slice();

			// all these will be active
			this.last_active = affected;
			
			//deactivate everything in last_active that isn't active
			for (j = 0; j < oldLastActive.length; j++) {
				la = oldLastActive[j];
				i = 0;
				while((aff = toBeActivated[i])){
					if(la == aff){
						toBeActivated.splice(i,1);break;
					}else{
						i++;
					}
				}
				if(!aff){
					this.deactivate(la, moveable, event);
				}
				if(!propagate) return;
			}
			for(var i =0; i < toBeActivated.length; i++){
				this.activate(toBeActivated[i], moveable, event);
				if(!propagate) return;
			}
			//activate everything in affected that isn't in last_active
			
			for (i = 0; i < affected.length; i++) {
				this.move(affected[i], moveable, event);
				
				if(!propagate) return;
			}
		},
		end: function( event, moveable ) {
			var responder, la, endName = this.lowerName+'end';
			
			// call dropon
			//go through the actives ... if you are over one, call dropped on it
			for(var i = 0; i < this.last_active.length; i++){
				la = this.last_active[i]
				if( this.isAffected(event.vector(), moveable, la)  && la[this.endName]){
					la.callHandlers(this.endName, null, event, moveable);
				}
			}
			// call dropend
			for(var r =0; r<this._elements.length; r++){
				$.data(this._elements[r],"_dropData").callHandlers(endName, null, event, moveable);
			}

			this.clear();
		},
		/**
		 * Called after dragging has stopped.
		 * @hide
		 */
		clear: function() {
		  this._elements.each(function(){
		  	$.removeData(this,"_dropData")
		  })
		  this._elements = $();
		  delete this.dragging;
		  //this._responders = [];
		}
	})
	$.Drag.responder = $.Drop;
	
	$.extend($.Drop.prototype,{
		callHandlers: function( method, el, ev, drag ) {
			var length = this[method] ? this[method].length : 0
			for(var i =0; i < length; i++){
				this[method][i].call(el || this.element[0], ev, this, drag)
			}
		},
		/**
		 * Caches positions of draggable elements.  This should be called in dropinit.  For example:
		 * @codestart
		 * dropinit: function( el, ev, drop ) { drop.cache_position() }
		 * @codeend
		 */
		cache: function( value ) {
			this._cache = value != null ? value : true;
		},
		/**
		 * Prevents this drop from being dropped on.
		 */
		cancel: function() {
			this._canceled = true;
		}
	} )
})(jQuery);

//jquery.event.drag.scroll.js

(function($){ //needs drop to determine if respondable

/**
 * @add jQuery.Drag.prototype
 */
$.Drag.prototype.
	/**
	 * Will scroll elements with a scroll bar as the drag moves to borders.
	 * @plugin jquery/event/drag/scroll
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/scroll/scroll.js
	 * @param {jQuery} elements to scroll.  The window can be in this array.
	 * @param {Object} options changes the default settings.
	 * 
	 *   - distance {number} 30 - how many pixels away from a boundry where we start scrolling
	 *   - delta(diff) {Function} - returns how far we should scroll.  It is passed how many pixels the cursor is
	 *     from the boundry.
	 *   - direction {String} - direction scrolling should happen.  "xy" is the default.
	 */
	scrolls = function(elements, options){
		var elements = $(elements);
		
		for(var i = 0 ; i < elements.length; i++){
			this.constructor.responder._elements.push( elements.eq(i).data("_dropData", new $.Scrollable(elements[i], options) )[0] )
		}
	},
	
$.Scrollable = function(element, options){
	this.element = jQuery(element);
	this.options = $.extend({
		// when  we should start scrolling
		distance : 30,
		// how far we should move
		delta : function(diff, distance){
			return (distance - diff) / 2;
		},
		direction: "xy"
	}, options);
	this.x = this.options.direction.indexOf("x") != -1;
	this.y = this.options.direction.indexOf("y") != -1;
}
$.extend($.Scrollable.prototype,{
	init: function( element ) {
		this.element = jQuery(element);
	},
	callHandlers: function( method, el, ev, drag ) {
		this[method](el || this.element[0], ev, this, drag)
	},
	dropover: function() {
		
	},
	dropon: function() {
		this.clear_timeout();
	}, 
	dropout: function() {
		this.clear_timeout();
	},
	dropinit: function() {
		
	},
	dropend: function() {},
	clear_timeout: function() {
		if(this.interval){
			clearTimeout(this.interval)
			this.interval = null;
		}
	},
	distance: function( diff ) {
		return (30 - diff) / 2;
	},
	dropmove: function( el, ev, drop, drag ) {
		
		//if we were about to call a move, clear it.
		this.clear_timeout();
		
		//position of the mouse
		var mouse = ev.vector(),
		
		//get the object we are going to get the boundries of
			location_object = $(el == document.documentElement ? window : el),
		
		//get the dimension and location of that object
			dimensions = location_object.dimensionsv('outer'),
			position = location_object.offsetv(),
		
		//how close our mouse is to the boundries
			bottom = position.y()+dimensions.y() - mouse.y(),
			top = mouse.y() - position.y(),
			right = position.x()+dimensions.x() - mouse.x(),
			left = mouse.x() - position.x(),
		
		//how far we should scroll
			dx =0, dy =0,
			distance =  this.options.distance;

		//check if we should scroll
		if(bottom < distance && this.y)
			dy = this.options.delta(bottom,distance);
		else if(top < distance && this.y)
			dy = -this.options.delta(top,distance)
		if(right < distance && this.options && this.x)
			dx = this.options.delta(right,distance);
		else if(left < distance && this.x)
			dx = -this.options.delta(left,distance);
		
		//if we should scroll
		if(dx || dy){
			//set a timeout that will create a mousemove on that object
			var self = this;
			this.interval =  setTimeout( function(){
				self.move($(el), drag.movingElement, dx, dy, ev, ev.clientX, ev.clientY, ev.screenX, ev.screenY)
			},15)
		}
	},
	/**
	 * Scrolls an element then calls mouse a mousemove in the same location.
	 * @param {HTMLElement} scroll_element the element to be scrolled
	 * @param {HTMLElement} drag_element
	 * @param {Number} dx how far to scroll
	 * @param {Number} dy how far to scroll
	 * @param {Number} x the mouse position
	 * @param {Number} y the mouse position
	 */
	move: function( scroll_element, drag_element, dx, dy, ev/*, x,y,sx, sy*/ ) {
		scroll_element.scrollTop( scroll_element.scrollTop() + dy);
		scroll_element.scrollLeft(scroll_element.scrollLeft() + dx);
		
		drag_element.trigger(
			$.event.fix({type: "mousemove", 
					 clientX: ev.clientX, 
					 clientY: ev.clientY, 
					 screenX: ev.screenX, 
					 screenY: ev.screenY,
					 pageX:   ev.pageX,
					 pageY:   ev.pageY}))
		//drag_element.synthetic('mousemove',{clientX: x, clientY: y, screenX: sx, screenY: sy})
	}
})

})(jQuery);

//jquery.event.drag.step.js

(function( $ ) {
	var round = function( x, m ) {
		return Math.round(x / m) * m;
	}

	$.Drag.prototype.
	/**
	 * @function step
	 * @plugin jquery/event/drag/step
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/drag/step/step.js
	 * makes the drag move in steps of amount pixels.
	 * 
	 *     drag.step({x: 5}, $('foo'), "xy")
	 * 
	 * ## Demo
	 * 
	 * @demo jquery/event/drag/step/step.html
	 * 
	 * @param {number|Object} amount make the drag move X amount in pixels from the top-left of container.
	 * @param {jQuery} [container] the container to move in reference to.  If not provided, the document is used.
	 * @param {String} [center] Indicates how to position the drag element in relationship to the container.
	 * 
	 *   -  If nothing is provided, places the top left corner of the drag element at
	 *      'amount' intervals from the top left corner of the container.  
	 *   -  If 'x' is provided, it centers the element horizontally on the top-left corner.
	 *   -  If 'y' is provided, it centers the element vertically on the top-left corner of the container.
	 *   -  If 'xy' is provided, it centers the element on the top-left corner of the container.
	 *   
	 * @return {jQuery.Drag} the drag object for chaining.
	 */
	step = function( amount, container, center ) {
		//on draws ... make sure this happens
		if ( typeof amount == 'number' ) {
			amount = {
				x: amount,
				y: amount
			}
		}
		container = container || $(document.body);
		this._step = amount;

		var styles = container.curStyles("borderTopWidth", "paddingTop", "borderLeftWidth", "paddingLeft");
		var top = parseInt(styles.borderTopWidth) + parseInt(styles.paddingTop),
			left = parseInt(styles.borderLeftWidth) + parseInt(styles.paddingLeft);

		this._step.offset = container.offsetv().plus(left, top);
		this._step.center = center;
		return this;
	};


	var oldPosition = $.Drag.prototype.position;
	$.Drag.prototype.position = function( offsetPositionv ) {
		//adjust required_css_position accordingly
		if ( this._step ) {
			var step = this._step,
				center = step.center && step.center.toLowerCase(),
				movingSize = this.movingElement.dimensionsv('outer'),
				lot = step.offset.top()- (center && center != 'x' ? movingSize.height() / 2 : 0),
				lof = step.offset.left() - (center && center != 'y' ? movingSize.width() / 2 : 0);

			if ( this._step.x ) {
				offsetPositionv.left(Math.round(lof + round(offsetPositionv.left() - lof, this._step.x)))
			}
			if ( this._step.y ) {
				offsetPositionv.top(Math.round(lot + round(offsetPositionv.top() - lot, this._step.y)))
			}
		}

		oldPosition.call(this, offsetPositionv)
	}

})(jQuery);

//jquery.event.hover.js

(function($){
/**
 * @class jQuery.Hover
 * @plugin jquery/event/hover
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/hover/hover.js
 * Provides delegate-able hover events.
 * <p>
 * 	A hover happens when the mouse stops moving 
 * over an element for a period of time.  You can listen
 * and configure hover with the following events:
 * </p>
 * <ul>
 * 	<li><code>[jQuery.event.special.hoverinit hoverinit]</code> - called on mouseenter, use this event to customize 
 *      [jQuery.Hover.prototype.delay] and [jQuery.Hover.prototype.distance]</li>
 *  <li><code>[jQuery.event.special.hoverenter hoverenter]</code> - an element is being hovered</li>
 *  <li><code>[jQuery.event.special.hovermove hovermove]</code> - the mouse moves on an element that has been hovered</li>
 *  <li><code>[jQuery.event.special.hoverleave hoverleave]</code> - the mouse leaves the element that has been hovered</li>
 * </ul>
 * <h3>Quick Example</h3>
 * The following listens for hoverenter and adds a class to style
 * the element, and removes the class on hoverleave.
 * @codestart
 * $('#menu').delegate(".option","hoverenter",function(){
 *   $(this).addClass("hovering");
 * }).delegate(".option","hoverleave",function(){
 *   $(this).removeClass("hovering");
 * })
 * @codeend
 * <h2>Configuring Distance and Delay</h2>
 * <p>An element is hovered when the mouse
 *   moves less than a certain distance in 
 *   specific time over the element.
 * </p>
 * <p>
 *   You can configure that distance and time by
 *   adjusting the <code>distance</code> and 
 *   <code>delay</code> values.  
 * </p>
 * <p>You can set delay and distance globally
 * by adjusting the static properties:</p>
 * </p>
 * @codestart
 * $.Hover.delay = 10
 * $.Hover.distance = 1
 * @codeend
 * <p>Or you can adjust delay and distance for
 * an individual element in hoverenter:</p>
 * @codestart
 * $(".option").delegate("hoverinit", function(ev, hover){
 * //set the distance to 10px
 * hover.distance(10)
 * //set the delay to 200ms
 * hover.delay(10)
 * })
 * @codeend
 * <h2>Demo</h2>
 * @demo jquery/event/hover/hover.html
 * @parent specialevents
 * @constructor Creates a new hover.  This is never
 * called directly.
 */
$.Hover = function(){
	this._delay =  $.Hover.delay;
	this._distance = $.Hover.distance;
	this._leave = $.Hover.leave
};
/**
 * @Static
 */
$.extend($.Hover,{
	/**
	 * @attribute delay
	 * A hover is  activated if it moves less than distance in this time.
	 * Set this value as a global default.
	 */
	delay: 100,
	/**
	 * @attribute distance
	 * A hover is activated if it moves less than this distance in delay time.
	 * Set this value as a global default.
	 */
	distance: 10,
	leave : 0
})

/**
 * @Prototype
 */
$.extend($.Hover.prototype,{
	/**
	 * Sets the delay for this hover.  This method should
	 * only be used in hoverinit.
	 * @param {Number} delay the number of milliseconds used to determine a hover
	 * 
	 */
	delay: function( delay ) {
		this._delay = delay;
		return this;
	},
	/**
	 * Sets the distance for this hover.  This method should
	 * only be used in hoverinit.
	 * @param {Number} distance the max distance in pixels a mouse can move to be considered a hover
	 */
	distance: function( distance ) {
		this._distance = distance;
		return this;
	},
	leave : function(leave){
		this._leave = leave;
		return this;
	}
})
var event = $.event, 
	handle  = event.handle,
	onmouseenter = function(ev){
		//now start checking mousemoves to update location
		var delegate = ev.liveFired || ev.currentTarget;
		var selector = ev.handleObj.selector;
		//prevents another mouseenter until current has run its course
		if($.data(delegate,"_hover"+selector)){
			return;
		}
		$.data(delegate,"_hover"+selector, true)
		var loc = {
				pageX : ev.pageX,
				pageY : ev.pageY
			}, 
			dist = 0, 
			timer, 
			enteredEl = this, 
			hovered = false,
			lastEv = ev, 
			hover = new $.Hover(),
			leaveTimer,
			callHoverLeave = function(){
				$.each(event.find(delegate, ["hoverleave"], selector), function(){
					this.call(enteredEl, ev, hover)
				})
				cleanUp();
			},
			mouseenter = function(ev){
				clearTimeout(leaveTimer);
				dist += Math.pow( ev.pageX-loc.pageX, 2 ) + Math.pow( ev.pageY-loc.pageY, 2 ); 
				loc = {
					pageX : ev.pageX,
					pageY : ev.pageY
				}
				lastEv = ev
			},
			mouseleave = function(ev){
				clearTimeout(timer);
				// go right away
				if(hovered){
					if(hover._leave === 0){
						callHoverLeave();
					}else{
						clearTimeout(leaveTimer);
						leaveTimer = setTimeout(function(){
							callHoverLeave();
						}, hover._leave)
					}
				}else{
					cleanUp();
				}
			},
			cleanUp = function(){
				$(enteredEl).unbind("mouseleave",mouseleave)
				$(enteredEl).unbind("mousemove",mouseenter);
				$.removeData(delegate,"_hover"+selector)
			};
		
		$(enteredEl).bind("mousemove",mouseenter).bind("mouseleave", mouseleave);
		$.each(event.find(delegate, ["hoverinit"], selector), function(){
			this.call(enteredEl, ev, hover)
		})
		
		timer = setTimeout(function(){
			//check that we aren't moveing around
			if(dist < hover._distance && $(enteredEl).queue().length == 0){
				$.each(event.find(delegate, ["hoverenter"], selector), function(){
					this.call(enteredEl, lastEv, hover)
				})
				hovered = true;
				return;
			}else{
				dist = 0;
				timer = setTimeout(arguments.callee, hover._delay)
			}
		}, hover._delay)
		
	};
		
/**
 * @add jQuery.event.special
 */
event.setupHelper( [
/**
 * @attribute hoverinit
 * Listen for hoverinit events to configure
 * [jQuery.Hover.prototype.delay] and [jQuery.Hover.prototype.distance]
 * for the current element.  Hoverinit is called on mouseenter.
 * @codestart
 * $(".option").delegate("hoverinit", function(ev, hover){
 *    //set the distance to 10px
 *    hover.distance(10)
 *    //set the delay to 200ms
 *    hover.delay(10)
 * })
 * @codeend
 */
"hoverinit", 
/**
 * @attribute hoverenter
 * Hoverenter events are called when the mouses less 
 * than [jQuery.Hover.prototype.distance] pixels in 
 * [jQuery.Hover.prototype.delay] milliseconds.
 * @codestart
 * $(".option").delegate("hoverenter", function(ev, hover){
 *    $(this).addClass("hovering");
 * })
 * @codeend
 */
"hoverenter",
/**
 * @attribute hoverleave
 * Called when the mouse leaves an element that has been
 * hovered.
 * @codestart
 * $(".option").delegate("hoverleave", function(ev, hover){
 *    $(this).removeClass("hovering");
 * })
 * @codeend
 */
"hoverleave",
/**
 * @attribute hovermove
 * Called when the mouse moves on an element that 
 * has been hovered.
 * @codestart
 * $(".option").delegate("hovermove", function(ev, hover){
 *    //not sure why you would want to listen for this
 *    //but we provide it just in case
 * })
 * @codeend
 */
"hovermove"], "mouseenter", onmouseenter )
		

	
})(jQuery);

//jquery.event.resize.js

(function( $ ) {
	/**
	 * @add jQuery.event.special
	 */
	var resizers = $(),
		resizeCount = 0,
		// bind on the window window resizes to happen
		win = $(window),
		windowWidth = 0,
		windowHeight = 0,
		timer;

	$(function() {
		windowWidth = win.width();
		windowHeight = win.height();
	})

	/**
	 * @attribute resize
	 * @parent specialevents
	 * 
	 * The resize event is useful for updating elements dimensions when a parent element
	 * has been resized.  It allows you to only resize elements that need to be resized 
	 * in the 'right order'.
	 * 
	 * By listening to a resize event, you will be alerted whenever a parent 
	 * element has a <code>resize</code> event triggered on it.  For example:
	 * 
	 *     $('#foo').bind('resize', function(){
	 *        // adjust #foo's dimensions
	 *     })
	 *     
	 *     $(document.body).trigger("resize");
	 * 
	 * ## The 'Right Order'
	 * 
	 * When a control changes size, typically, you want only internal controls to have to adjust their
	 * dimensions.  Furthermore, you want to adjust controls from the 'outside-in', meaning
	 * that the outermost control adjusts its dimensions before child controls adjust theirs.
	 * 
	 * Resize calls resize events in exactly this manner.  
	 * 
	 * When you trigger a resize event, it will propagate up the DOM until it reaches
	 * an element with the first resize event 
	 * handler.  There it will move the event in the opposite direction, calling the element's
	 * children's resize event handlers.
	 *
	 * If your intent is to call resize without bubbling and only trigger child element's handlers,
	 * use the following:
	 *
	 *     $("#foo").trigger("resize", false);
	 * 
	 * ## Stopping Children Updates
	 * 
	 * If your element doesn't need to change it's dimensions as a result of the parent element, it should
	 * call ev.stopPropagation().  This will only stop resize from being sent to child elements of the current element.
	 * 
	 * 
	 */
	$.event.special.resize = {
		setup: function( handleObj ) {
			// add and sort the resizers array
			// don't add window because it can't be compared easily
			if ( this !== window ) {
				resizers.push(this);
				$.unique(resizers);
			}
			// returns false if the window
			return this !== window;
		},
		teardown: function() {
			// we shouldn't have to sort
			resizers = resizers.not(this);

			// returns false if the window
			return this !== window;
		},
		add: function( handleObj ) {
			// increment the number of resizer elements
			//$.data(this, "jquery.dom.resizers", ++$.data(this, "jquery.dom.resizers") );
			var origHandler = handleObj.handler;
			handleObj.origHandler = origHandler;

			handleObj.handler = function( ev, data ) {
				var isWindow = this === window;

				// if we are the window and a real resize has happened
				// then we check if the dimensions actually changed
				// if they did, we will wait a brief timeout and 
				// trigger resize on the window
				// this is for IE, to prevent window resize 'infinate' loop issues
				if ( isWindow && ev.originalEvent ) {
					var width = win.width(),
						height = win.height();


					if ((width != windowWidth || height != windowHeight)) {
						//update the new dimensions
						windowWidth = width;
						windowHeight = height;
						clearTimeout(timer)
						timer = setTimeout(function() {
							win.trigger("resize");
						}, 1);

					}
					return;
				}

				// if this is the first handler for this event ...
				if ( resizeCount === 0 ) {
					// prevent others from doing what we are about to do
					resizeCount++;
					var where = data === false ? ev.target : this

					//trigger all this element's handlers
					$.event.handle.call(where, ev);
					if ( ev.isPropagationStopped() ) {
						resizeCount--;
						return;
					}

					// get all other elements within this element that listen to resize
					// and trigger their resize events
					var index = resizers.index(this),
						length = resizers.length,
						child, sub;

					// if index == -1 it's the window
					while (++index < length && (child = resizers[index]) && (isWindow || $.contains(where, child)) ) {

						// call the event
						$.event.handle.call(child, ev);

						if ( ev.isPropagationStopped() ) {
							// move index until the item is not in the current child
							while (++index < length && (sub = resizers[index]) ) {
								if (!$.contains(child, sub) ) {
									// set index back one
									index--;
									break
								}
							}
						}
					}

					// prevent others from responding
					ev.stopImmediatePropagation();
					resizeCount--;
				} else {
					handleObj.origHandler.call(this, ev, data);
				}
			}
		}
	};

	// automatically bind on these
	$([document, window]).bind('resize', function() {})
})(jQuery);

//jquery.event.pause.js

(function($){


var current,
	rnamespaces = /\.(.*)$/,
	returnFalse = function(){return false},
	returnTrue = function(){return true};

/**
 * @function
 * @parent jquery.event.pause
 * Pauses an event (to be resumed later);
 */
//
/**
 * @function
 * @parent jquery.event.pause
 * 
 * Resumes an event
 */
//
/**
 * @page jquery.event.pause Pause-Resume
 * @plugin jquery/event/pause
 * @parent specialevents
 * The jquery/event/pause plugin adds the ability to pause and 
 * resume events. 
 * 
 *     $('#todos').bind('show', function(ev){
 *       ev.pause();
 *       
 *       $(this).load('todos.html', function(){
 *         ev.resume();
 *       });
 *     })
 * 
 * When an event is paused, stops calling other event handlers for the 
 * event (similar to event.stopImmediatePropagation() ).  But when 
 * resume is called on the event, it will begin calling events on event handlers
 * after the 'paused' event handler.
 * 
 * 
 * Pause-able events complement the [jQuery.event.special.default default]
 * events plugin, providing the ability to easy create widgets with 
 * an asynchronous API.  
 * 
 * ## Example
 * 
 * Consider a basic tabs widget that:
 * 
 *   - trigger's a __show__ event on panels when they are to be displayed
 *   - shows the panel after the show event.
 *   
 * The sudo code for this controller might look like:
 * 
 *     $.Controller('Tabs',{
 *       ".button click" : function( el ){
 *         var panel = this.getPanelFromButton( el );
 *         panel.triggerAsync('show', function(){
 *           panel.show();
 *         })
 *       }
 *     })
 *     
 * Someone using this plugin would be able to delay the panel showing until ready:
 * 
 *     $('#todos').bind('show', function(ev){
 *       ev.pause();
 *       
 *       $(this).load('todos.html', function(){
 *         ev.resume();
 *       });
 *     })
 * 
 * Or prevent the panel from showing at all:
 * 
 *     $('#todos').bind('show', function(ev){
 *       if(! isReady()){
 *         ev.preventDefault();
 *       }
 *     })
 *     
 * ## Limitations
 * 
 * The element and event handler that the <code>pause</code> is within can not be removed before 
 * resume is called.
 * 
 * ## Big Example
 * 
 * The following example shows a tabs widget where the user is prompted to save, ignore, or keep editing
 * a tab when a new tab is clicked.
 * 
 * @demo jquery/event/pause/pause.html
 * 
 * It's a long, but great example of how to do some pretty complex state management with JavaScriptMVC.
 * 
 */
$.Event.prototype.isPaused = returnFalse


$.Event.prototype.pause = function(){
	current = this;
	this.stopImmediatePropagation();
	this.isPaused = returnTrue;
};

$.Event.prototype.resume = function(){
	this.isPaused = this.isImmediatePropagationStopped = this.isPropagationStopped = returnFalse;
	
	var el = this.liveFired || this.currentTarget || this.target,
		defult = $.event.special['default'], 
		oldType = this.type;
	
	// if we were in a 'live' -> run our liveHandler
	if(this.handleObj.origHandler){
		var cur = this.currentTarget;
		this.currentTarget = this.liveFired;
		this.liveFired = undefined;
		
		liveHandler.call(el, this, cur );
		el = cur;
	}
	if(this.isImmediatePropagationStopped()){
		return false;
	}
	
	// skip the event the first pass because we've already handled it
	this.firstPass = true;
	
	if(!this.isPropagationStopped()){
		$.event.trigger(this, [this.handleObj], el, false);
	}
	
};


function liveHandler( event, after ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

					// Make sure not to accidentally match a child element with the same selector
					if ( related && jQuery.contains( elem, related ) ) {
						related = elem;
					}
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];
		// inserted to only call elements after this point ...
		if(after) {
			if(after === match.elem){
				after = undefined;
			}
			continue;
		}

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

})(jQuery);

//jquery.view.js

(function( $ ) {

	// converts to an ok dom id
	var toId = function( src ) {
		return src.replace(/^\/\//, "").replace(/[\/\.]/g, "_");
	},
		// used for hookup ids
		id = 1;
	// this might be useful for testing if html
	// htmlTest = /^[\s\n\r\xA0]*<(.|[\r\n])*>[\s\n\r\xA0]*$/
	/**
	 * @class jQuery.View
	 * @parent jquerymx
	 * @plugin jquery/view
	 * @test jquery/view/qunit.html
	 * @download dist/jquery.view.js
	 * 
	 * View provides a uniform interface for using templates with 
	 * jQuery. When template engines [jQuery.View.register register] 
	 * themselves, you are able to:
	 * 
	 *  - Use views with jQuery extensions [jQuery.fn.after after], [jQuery.fn.append append],
	 *   [jQuery.fn.before before], [jQuery.fn.html html], [jQuery.fn.prepend prepend],
	 *   [jQuery.fn.replaceWith replaceWith], [jQuery.fn.text text].
	 *  - Template loading from html elements and external files.
	 *  - Synchronous and asynchronous template loading.
	 *  - [view.deferreds Deferred Rendering].
	 *  - Template caching.
	 *  - Bundling of processed templates in production builds.
	 *  - Hookup jquery plugins directly in the template.
	 * 
	 * The [mvc.view Get Started with jQueryMX] has a good walkthrough of $.View.
	 * 
	 * ## Use
	 * 
	 * 
	 * When using views, you're almost always wanting to insert the results 
	 * of a rendered template into the page. jQuery.View overwrites the 
	 * jQuery modifiers so using a view is as easy as: 
	 * 
	 *     $("#foo").html('mytemplate.ejs',{message: 'hello world'})
	 *
	 * This code:
	 * 
	 *  - Loads the template a 'mytemplate.ejs'. It might look like:
	 *    <pre><code>&lt;h2>&lt;%= message %>&lt;/h2></pre></code>
	 *  
	 *  - Renders it with {message: 'hello world'}, resulting in:
	 *    <pre><code>&lt;div id='foo'>"&lt;h2>hello world&lt;/h2>&lt;/div></pre></code>
	 *  
	 *  - Inserts the result into the foo element. Foo might look like:
	 *    <pre><code>&lt;div id='foo'>&lt;h2>hello world&lt;/h2>&lt;/div></pre></code>
	 * 
	 * ## jQuery Modifiers
	 * 
	 * You can use a template with the following jQuery modifiers:
	 * 
	 * <table>
	 * <tr><td>[jQuery.fn.after after]</td><td> <code>$('#bar').after('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.append append] </td><td>  <code>$('#bar').append('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.before before] </td><td> <code>$('#bar').before('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.html html] </td><td> <code>$('#bar').html('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.prepend prepend] </td><td> <code>$('#bar').prepend('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.replaceWith replaceWith] </td><td> <code>$('#bar').replaceWidth('temp.jaml',{});</code></td></tr>
	 * <tr><td>[jQuery.fn.text text] </td><td> <code>$('#bar').text('temp.jaml',{});</code></td></tr>
	 * </table>
	 * 
	 * You always have to pass a string and an object (or function) for the jQuery modifier 
	 * to user a template.
	 * 
	 * ## Template Locations
	 * 
	 * View can load from script tags or from files. 
	 * 
	 * ## From Script Tags
	 * 
	 * To load from a script tag, create a script tag with your template and an id like: 
	 * 
	 * <pre><code>&lt;script type='text/ejs' id='recipes'>
	 * &lt;% for(var i=0; i &lt; recipes.length; i++){ %>
	 *   &lt;li>&lt;%=recipes[i].name %>&lt;/li>
	 * &lt;%} %>
	 * &lt;/script></code></pre>
	 * 
	 * Render with this template like: 
	 * 
	 * @codestart
	 * $("#foo").html('recipes',recipeData)
	 * @codeend
	 * 
	 * Notice we passed the id of the element we want to render.
	 * 
	 * ## From File
	 * 
	 * You can pass the path of a template file location like:
	 * 
	 *     $("#foo").html('templates/recipes.ejs',recipeData)
	 * 
	 * However, you typically want to make the template work from whatever page they 
	 * are called from.  To do this, use // to look up templates from JMVC root:
	 * 
	 *     $("#foo").html('//app/views/recipes.ejs',recipeData)
	 *     
	 * Finally, the [jQuery.Controller.prototype.view controller/view] plugin can make looking
	 * up a thread (and adding helpers) even easier:
	 * 
	 *     $("#foo").html( this.view('recipes', recipeData) )
	 * 
	 * ## Packaging Templates
	 * 
	 * If you're making heavy use of templates, you want to organize 
	 * them in files so they can be reused between pages and applications.
	 * 
	 * But, this organization would come at a high price 
	 * if the browser has to 
	 * retrieve each template individually. The additional 
	 * HTTP requests would slow down your app. 
	 * 
	 * Fortunately, [steal.static.views steal.views] can build templates 
	 * into your production files. You just have to point to the view file like: 
	 * 
	 *     steal.views('path/to/the/view.ejs');
	 *
	 * ## Asynchronous
	 * 
	 * By default, retrieving requests is done synchronously. This is 
	 * fine because StealJS packages view templates with your JS download. 
	 * 
	 * However, some people might not be using StealJS or want to delay loading 
	 * templates until necessary. If you have the need, you can 
	 * provide a callback paramter like: 
	 * 
	 *     $("#foo").html('recipes',recipeData, function(result){
	 *       this.fadeIn()
	 *     });
	 * 
	 * The callback function will be called with the result of the 
	 * rendered template and 'this' will be set to the original jQuery object.
	 * 
	 * ## Deferreds (3.0.6)
	 * 
	 * If you pass deferreds to $.View or any of the jQuery 
	 * modifiers, the view will wait until all deferreds resolve before 
	 * rendering the view.  This makes it a one-liner to make a request and 
	 * use the result to render a template. 
	 * 
	 * The following makes a request for todos in parallel with the 
	 * todos.ejs template.  Once todos and template have been loaded, it with
	 * render the view with the todos.
	 * 
	 *     $('#todos').html("todos.ejs",Todo.findAll());
	 * 
	 * ## Just Render Templates
	 * 
	 * Sometimes, you just want to get the result of a rendered 
	 * template without inserting it, you can do this with $.View: 
	 * 
	 *     var out = $.View('path/to/template.jaml',{});
	 *     
	 * ## Preloading Templates
	 * 
	 * You can preload templates asynchronously like:
	 * 
	 *     $.get('path/to/template.jaml',{},function(){},'view');
	 * 
	 * ## Supported Template Engines
	 * 
	 * JavaScriptMVC comes with the following template languages:
	 * 
	 *   - EmbeddedJS
	 *     <pre><code>&lt;h2>&lt;%= message %>&lt;/h2></code></pre>
	 *     
	 *   - JAML
	 *     <pre><code>h2(data.message);</code></pre>
	 *     
	 *   - Micro
	 *     <pre><code>&lt;h2>{%= message %}&lt;/h2></code></pre>
	 *     
	 *   - jQuery.Tmpl
	 *     <pre><code>&lt;h2>${message}&lt;/h2></code></pre>
	 
	 * 
	 * The popular <a href='http://awardwinningfjords.com/2010/08/09/mustache-for-javascriptmvc-3.html'>Mustache</a> 
	 * template engine is supported in a 2nd party plugin.
	 * 
	 * ## Using other Template Engines
	 * 
	 * It's easy to integrate your favorite template into $.View and Steal.  Read 
	 * how in [jQuery.View.register].
	 * 
	 * @constructor
	 * 
	 * Looks up a template, processes it, caches it, then renders the template
	 * with data and optional helpers.
	 * 
	 * With [stealjs StealJS], views are typically bundled in the production build.
	 * This makes it ok to use views synchronously like:
	 * 
	 * @codestart
	 * $.View("//myplugin/views/init.ejs",{message: "Hello World"})
	 * @codeend
	 * 
	 * If you aren't using StealJS, it's best to use views asynchronously like:
	 * 
	 * @codestart
	 * $.View("//myplugin/views/init.ejs",
	 *        {message: "Hello World"}, function(result){
	 *   // do something with result
	 * })
	 * @codeend
	 * 
	 * @param {String} view The url or id of an element to use as the template's source.
	 * @param {Object} data The data to be passed to the view.
	 * @param {Object} [helpers] Optional helper functions the view might use. Not all
	 * templates support helpers.
	 * @param {Object} [callback] Optional callback function.  If present, the template is 
	 * retrieved asynchronously.  This is a good idea if you aren't compressing the templates
	 * into your view.
	 * @return {String} The rendered result of the view or if deferreds are passed, a deferred that will contain
	 * the rendered result of the view.
	 */

	var $view, render, checkText, get, getRenderer, isDeferred = function( obj ) {
		return obj && $.isFunction(obj.always) // check if obj is a $.Deferred
	},
		// gets an array of deferreds from an object
		// this only goes one level deep
		getDeferreds = function( data ) {
			var deferreds = [];

			// pull out deferreds
			if ( isDeferred(data) ) {
				return [data]
			} else {
				for ( var prop in data ) {
					if ( isDeferred(data[prop]) ) {
						deferreds.push(data[prop]);
					}
				}
			}
			return deferreds;
		},
		// gets the useful part of deferred
		// this is for Models and $.ajax that give arrays
		usefulPart = function( resolved ) {
			return $.isArray(resolved) && resolved.length === 3 && resolved[1] === 'success' ? resolved[0] : resolved
		};

	$view = $.View = function( view, data, helpers, callback ) {
		if ( typeof helpers === 'function' ) {
			callback = helpers;
			helpers = undefined;
		}

		// see if we got passed any deferreds
		var deferreds = getDeferreds(data);


		if ( deferreds.length ) { // does data contain any deferreds?
			// the deferred that resolves into the rendered content ...
			var deferred = $.Deferred();

			// add the view request to the list of deferreds
			deferreds.push(get(view, true))

			// wait for the view and all deferreds to finish
			$.when.apply($, deferreds).then(function( resolved ) {
				var objs = $.makeArray(arguments),
					renderer = objs.pop()[0],
					result; //get the view render function
				// make data look like the resolved deferreds
				if ( isDeferred(data) ) {
					data = usefulPart(resolved);
				}
				else {
					for ( var prop in data ) {
						if ( isDeferred(data[prop]) ) {
							data[prop] = usefulPart(objs.shift());
						}
					}
				}
				result = renderer(data, helpers);

				//resolve with the rendered view
				deferred.resolve(result); // this does not work as is...
				callback && callback(result);
			});
			// return the deferred ....
			return deferred.promise();
		}
		else {

			var response, async = typeof callback === "function",
				deferred = get(view, async);

			if ( async ) {
				response = deferred;
				deferred.done(function( renderer ) {
					callback(renderer(data, helpers))
				})
			} else {
				deferred.done(function( renderer ) {
					response = renderer(data, helpers);
				});
			}

			return response;
		}
	};
	// makes sure there's a template
	checkText = function( text, url ) {
		if (!text.match(/[^\s]/) ) {
			
			throw "$.View ERROR: There is no template or an empty template at " + url;
		}
	};
	get = function( url, async ) {
		return $.ajax({
			url: url,
			dataType: "view",
			async: async
		});
	};

	// you can request a view renderer (a function you pass data to and get html)
	$.ajaxTransport("view", function( options, orig ) {
		var view = orig.url,
			suffix = view.match(/\.[\w\d]+$/),
			type, el, id, renderer, url = view,
			jqXHR, response = function( text ) {
				var func = type.renderer(id, text);
				if ( $view.cache ) {
					$view.cached[id] = func;
				}
				return {
					view: func
				};
			};

		// if we have an inline template, derive the suffix from the 'text/???' part
		// this only supports '<script></script>' tags
		if ( el = document.getElementById(view) ) {
			suffix = el.type.match(/\/[\d\w]+$/)[0].replace(/^\//, '.');
		}

		//if there is no suffix, add one
		if (!suffix ) {
			suffix = $view.ext;
			url = url + $view.ext;
		}

		//convert to a unique and valid id
		id = toId(url);

		//if a absolute path, use steal to get it
		if ( url.match(/^\/\//) ) {
			if ( typeof steal === "undefined" ) {
				url = "/" + url.substr(2);
			}
			else {
				url = steal.root.mapJoin(url.substr(2));
			}
		}

		//get the template engine
		type = $view.types[suffix];

		return {
			send: function( headers, callback ) {
				if ( $view.cached[id] ) {
					return callback(200, "success", {
						view: $view.cached[id]
					});
				} else if ( el ) {
					callback(200, "success", response(el.innerHTML));
				} else {
					jqXHR = $.ajax({
						async: orig.async,
						url: url,
						dataType: "text",
						error: function() {
							checkText("", url);
							callback(404);
						},
						success: function( text ) {
							checkText(text, url);
							callback(200, "success", response(text))
						}
					});
				}
			},
			abort: function() {
				jqXHR && jqXHR.abort();
			}
		}
	})
	$.extend($view, {
		/**
		 * @attribute hookups
		 * @hide
		 * A list of pending 'hookups'
		 */
		hookups: {},
		/**
		 * @function hookup
		 * Registers a hookup function that can be called back after the html is 
		 * put on the page.  Typically this is handled by the template engine.  Currently
		 * only EJS supports this functionality.
		 * 
		 *     var id = $.View.hookup(function(el){
		 *            //do something with el
		 *         }),
		 *         html = "<div data-view-id='"+id+"'>"
		 *     $('.foo').html(html);
		 * 
		 * 
		 * @param {Function} cb a callback function to be called with the element
		 * @param {Number} the hookup number
		 */
		hookup: function( cb ) {
			var myid = ++id;
			$view.hookups[myid] = cb;
			return myid;
		},
		/**
		 * @attribute cached
		 * @hide
		 * Cached are put in this object
		 */
		cached: {},
		/**
		 * @attribute cache
		 * Should the views be cached or reloaded from the server. Defaults to true.
		 */
		cache: true,
		/**
		 * @function register
		 * Registers a template engine to be used with 
		 * view helpers and compression.  
		 * 
		 * ## Example
		 * 
		 * @codestart
		 * $.View.register({
		 * 	suffix : "tmpl",
		 *  plugin : "jquery/view/tmpl",
		 * 	renderer: function( id, text ) {
		 * 		return function(data){
		 * 			return jQuery.render( text, data );
		 * 		}
		 * 	},
		 * 	script: function( id, text ) {
		 * 		var tmpl = $.tmpl(text).toString();
		 * 		return "function(data){return ("+
		 * 		  	tmpl+
		 * 			").call(jQuery, jQuery, data); }";
		 * 	}
		 * })
		 * @codeend
		 * Here's what each property does:
		 * 
		 *    * plugin - the location of the plugin
		 *    * suffix - files that use this suffix will be processed by this template engine
		 *    * renderer - returns a function that will render the template provided by text
		 *    * script - returns a string form of the processed template function.
		 * 
		 * @param {Object} info a object of method and properties 
		 * 
		 * that enable template integration:
		 * <ul>
		 *   <li>plugin - the location of the plugin.  EX: 'jquery/view/ejs'</li>
		 *   <li>suffix - the view extension.  EX: 'ejs'</li>
		 *   <li>script(id, src) - a function that returns a string that when evaluated returns a function that can be 
		 *    used as the render (i.e. have func.call(data, data, helpers) called on it).</li>
		 *   <li>renderer(id, text) - a function that takes the id of the template and the text of the template and
		 *    returns a render function.</li>
		 * </ul>
		 */
		register: function( info ) {
			this.types["." + info.suffix] = info;

			if ( window.steal ) {
				steal.type(info.suffix + " view js", function( options, orig, success, error ) {
					var type = $view.types["." + options.type],
						id = toId(options.rootSrc);

					options.text = type.script(id, options.text)
					success();
				})
			}
		},
		types: {},
		/**
		 * @attribute ext
		 * The default suffix to use if none is provided in the view's url.  
		 * This is set to .ejs by default.
		 */
		ext: ".ejs",
		/**
		 * Returns the text that 
		 * @hide 
		 * @param {Object} type
		 * @param {Object} id
		 * @param {Object} src
		 */
		registerScript: function( type, id, src ) {
			return "$.View.preload('" + id + "'," + $view.types["." + type].script(id, src) + ");";
		},
		/**
		 * @hide
		 * Called by a production script to pre-load a renderer function
		 * into the view cache.
		 * @param {String} id
		 * @param {Function} renderer
		 */
		preload: function( id, renderer ) {
			$view.cached[id] = function( data, helpers ) {
				return renderer.call(data, data, helpers);
			};
		}

	});
	if ( window.steal ) {
		steal.type("view js", function( options, orig, success, error ) {
			var type = $view.types["." + options.type],
				id = toId(options.rootSrc);

			options.text = "steal('" + (type.plugin || "jquery/view/" + options.type) + "').then(function($){" + "$.View.preload('" + id + "'," + options.text + ");\n})";
			success();
		})
	}

	//---- ADD jQUERY HELPERS -----
	//converts jquery functions to use views	
	var convert, modify, isTemplate, isHTML, getCallback, hookupView, funcs;

	convert = function( func_name ) {
		var old = $.fn[func_name];

		$.fn[func_name] = function() {
			var args = $.makeArray(arguments),
				callbackNum, callback, self = this,
				result;
			if ( isDeferred(args[0]) ) {
				args[0].done(function( res ) {
					modify.call(self, [res], old);
				})
				return this;
			}
			//check if a template
			else if ( isTemplate(args) ) {

				// if we should operate async
				if ((callbackNum = getCallback(args))) {
					callback = args[callbackNum];
					args[callbackNum] = function( result ) {
						modify.call(self, [result], old);
						callback.call(self, result);
					};
					$view.apply($view, args);
					return this;
				}
				result = $view.apply($view, args);
				if (!isDeferred(result) ) {
					args = [result];
				} else {
					result.done(function( res ) {
						modify.call(self, [res], old);
					})
					return this;
				}
			}
			return modify.call(this, args, old);

		};
	};

	// modifies the html of the element
	modify = function( args, old ) {
		var res, stub, hooks;

		//check if there are new hookups
		for ( var hasHookups in $view.hookups ) {
			break;
		}

		//if there are hookups, get jQuery object
		if ( hasHookups && args[0] && isHTML(args[0]) ) {
			hooks = $view.hookups;
			$view.hookups = {};
			args[0] = $(args[0]);
		}
		res = old.apply(this, args);

		//now hookup the hookups
		if ( hooks
		/* && args.length*/
		) {
			hookupView(args[0], hooks);
		}
		return res;
	};

	// returns true or false if the args indicate a template is being used
	isTemplate = function( args ) {
		var secArgType = typeof args[1];

		return typeof args[0] == "string" && (secArgType == 'object' || secArgType == 'function') && !args[1].nodeType && !args[1].jquery;
	};

	// returns whether the argument is some sort of HTML data
	isHTML = function( arg ) {
		if ( arg.jquery || arg.nodeType === 1 ) {
			// if jQuery object or DOM node we're good
			return true;
		} else if ( typeof arg === "string" ) {
			// if string, do a quick sanity check that we're HTML
			arg = $.trim(arg);
			return arg.substr(0, 1) === "<" && arg.substr(arg.length - 1, 1) === ">" && arg.length >= 3;
		} else {
			// don't know what you are
			return false;
		}
	};

	//returns the callback if there is one (for async view use)
	getCallback = function( args ) {
		return typeof args[3] === 'function' ? 3 : typeof args[2] === 'function' && 2;
	};

	hookupView = function( els, hooks ) {
		//remove all hookups
		var hookupEls, len, i = 0,
			id, func;
		els = els.filter(function() {
			return this.nodeType != 3; //filter out text nodes
		})
		hookupEls = els.add("[data-view-id]", els);
		len = hookupEls.length;
		for (; i < len; i++ ) {
			if ( hookupEls[i].getAttribute && (id = hookupEls[i].getAttribute('data-view-id')) && (func = hooks[id]) ) {
				func(hookupEls[i], id);
				delete hooks[id];
				hookupEls[i].removeAttribute('data-view-id');
			}
		}
		//copy remaining hooks back
		$.extend($view.hookups, hooks);
	};

	/**
	 *  @add jQuery.fn
	 *  @parent jQuery.View
	 *  Called on a jQuery collection that was rendered with $.View with pending hookups.  $.View can render a 
	 *  template with hookups, but not actually perform the hookup, because it returns a string without actual DOM 
	 *  elements to hook up to.  So hookup performs the hookup and clears the pending hookups, preventing errors in 
	 *  future templates.
	 *  
	 * @codestart
	 * $($.View('//views/recipes.ejs',recipeData)).hookup()
	 * @codeend
	 */
	$.fn.hookup = function() {
		var hooks = $view.hookups;
		$view.hookups = {};
		hookupView(this, hooks);
		return this;
	};

	/**
	 *  @add jQuery.fn
	 */
	funcs = [
	/**
	 *  @function prepend
	 *  @parent jQuery.View
	 *  
	 *  Extending the original [http://api.jquery.com/prepend/ jQuery().prepend()]
	 *  to render [jQuery.View] templates inserted at the beginning of each element in the set of matched elements.
	 *  
	 *  	$('#test').prepend('path/to/template.ejs', { name : 'javascriptmvc' });
	 *  
	 *  @param {String|Object|Function} content A template filename or the id of a view script tag 
	 *  or a DOM element, array of elements, HTML string, or jQuery object.
	 *  @param {Object} [data] The data to render the view with.
	 *  If rendering a view template this parameter always has to be present
	 *  (use the empty object initializer {} for no data).
	 */
	"prepend",
	/**
	 *  @function append
	 *  @parent jQuery.View
	 *  
	 *  Extending the original [http://api.jquery.com/append/ jQuery().append()]
	 *  to render [jQuery.View] templates inserted at the end of each element in the set of matched elements.
	 *  
	 *  	$('#test').append('path/to/template.ejs', { name : 'javascriptmvc' });
	 *  
	 *  @param {String|Object|Function} content A template filename or the id of a view script tag 
	 *  or a DOM element, array of elements, HTML string, or jQuery object.
	 *  @param {Object} [data] The data to render the view with.
	 *  If rendering a view template this parameter always has to be present
	 *  (use the empty object initializer {} for no data).
	 */
	"append",
	/**
	 *  @function after
	 *  @parent jQuery.View
	 *  
	 *  Extending the original [http://api.jquery.com/after/ jQuery().after()]
	 *  to render [jQuery.View] templates inserted after each element in the set of matched elements.
	 *  
	 *  	$('#test').after('path/to/template.ejs', { name : 'javascriptmvc' });
	 *  
	 *  @param {String|Object|Function} content A template filename or the id of a view script tag 
	 *  or a DOM element, array of elements, HTML string, or jQuery object.
	 *  @param {Object} [data] The data to render the view with.
	 *  If rendering a view template this parameter always has to be present
	 *  (use the empty object initializer {} for no data).
	 */
	"after",
	/**
	 *  @function before
	 *  @parent jQuery.View
	 *  
	 *  Extending the original [http://api.jquery.com/before/ jQuery().before()]
	 *  to render [jQuery.View] templates inserted before each element in the set of matched elements.
	 *  
	 *  	$('#test').before('path/to/template.ejs', { name : 'javascriptmvc' });
	 *  
	 *  @param {String|Object|Function} content A template filename or the id of a view script tag 
	 *  or a DOM element, array of elements, HTML string, or jQuery object.
	 *  @param {Object} [data] The data to render the view with.
	 *  If rendering a view template this parameter always has to be present
	 *  (use the empty object initializer {} for no data).
	 */
	"before",
	/**
	 *  @function text
	 *  @parent jQuery.View
	 *  
	 *  Extending the original [http://api.jquery.com/text/ jQuery().text()]
	 *  to render [jQuery.View] templates as the content of each matched element.
	 *  Unlike [jQuery.fn.html] jQuery.fn.text also works with XML, escaping the provided
	 *  string as necessary.
	 *  
	 *  	$('#test').text('path/to/template.ejs', { name : 'javascriptmvc' });
	 *  
	 *  @param {String|Object|Function} content A template filename or the id of a view script tag 
	 *  or a DOM element, array of elements, HTML string, or jQuery object.
	 *  @param {Object} [data] The data to render the view with.
	 *  If rendering a view template this parameter always has to be present
	 *  (use the empty object initializer {} for no data).
	 */
	"text",
	/**
	 *  @function html
	 *  @parent jQuery.View
	 *  
	 *  Extending the original [http://api.jquery.com/html/ jQuery().html()]
	 *  to render [jQuery.View] templates as the content of each matched element.
	 *  
	 *  	$('#test').html('path/to/template.ejs', { name : 'javascriptmvc' });
	 *  
	 *  @param {String|Object|Function} content A template filename or the id of a view script tag 
	 *  or a DOM element, array of elements, HTML string, or jQuery object.
	 *  @param {Object} [data] The data to render the view with.
	 *  If rendering a view template this parameter always has to be present
	 *  (use the empty object initializer {} for no data).
	 */
	"html",
	/**
	 *  @function replaceWith
	 *  @parent jQuery.View
	 *  
	 *  Extending the original [http://api.jquery.com/replaceWith/ jQuery().replaceWith()]
	 *  to render [jQuery.View] templates replacing each element in the set of matched elements.
	 *  
	 *  	$('#test').replaceWith('path/to/template.ejs', { name : 'javascriptmvc' });
	 *  
	 *  @param {String|Object|Function} content A template filename or the id of a view script tag 
	 *  or a DOM element, array of elements, HTML string, or jQuery object.
	 *  @param {Object} [data] The data to render the view with.
	 *  If rendering a view template this parameter always has to be present
	 *  (use the empty object initializer {} for no data).
	 */
	"replaceWith", "val"];

	//go through helper funcs and convert
	for ( var i = 0; i < funcs.length; i++ ) {
		convert(funcs[i]);
	}

})(jQuery);

//jquery.lang.string.rsplit.js

(function( $ ) {
	/**
	 * @add jQuery.String
	 */
	$.String.
	/**
	 * Splits a string with a regex correctly cross browser
	 * 
	 *     $.String.rsplit("a.b.c.d", /\./) //-> ['a','b','c','d']
	 * 
	 * @param {String} string The string to split
	 * @param {RegExp} regex A regular expression
	 * @return {Array} An array of strings
	 */
	rsplit = function( string, regex ) {
		var result = regex.exec(string),
			retArr = [],
			first_idx, last_idx;
		while ( result !== null ) {
			first_idx = result.index;
			last_idx = regex.lastIndex;
			if ( first_idx !== 0 ) {
				retArr.push(string.substring(0, first_idx));
				string = string.slice(first_idx);
			}
			retArr.push(result[0]);
			string = string.slice(result[0].length);
			result = regex.exec(string);
		}
		if ( string !== '' ) {
			retArr.push(string);
		}
		return retArr;
	};
})(jQuery);

//jquery.view.ejs.js

(function( $ ) {
	var myEval = function( script ) {
		eval(script);
	},
		chop = function( string ) {
			return string.substr(0, string.length - 1);
		},
		rSplit = $.String.rsplit,
		extend = $.extend,
		isArray = $.isArray,
		clean = function( content ) {
			var converted = content.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"').replace(/\t/g, '\\t');
			return converted;
		},
		// from prototype  http://www.prototypejs.org/
		escapeHTML = function( content ) {
			return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&#34;').replace(/'/g, "&#39;");
		},
		EJS = function( options ) {
			//returns a renderer function
			if ( this.constructor != EJS ) {
				var ejs = new EJS(options);
				return function( data, helpers ) {
					return ejs.render(data, helpers);
				};
			}
			//so we can set the processor
			if ( typeof options == "function" ) {
				this.template = {};
				this.template.process = options;
				return;
			}
			//set options on self
			extend(this, EJS.options, options);
			this.template = compile(this.text, this.type, this.name);
		};
	/**
	 * @class jQuery.EJS
	 * 
	 * @plugin jquery/view/ejs
	 * @parent jQuery.View
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/view/ejs/ejs.js
	 * @test jquery/view/ejs/qunit.html
	 * 
	 * 
	 * Ejs provides <a href="http://www.ruby-doc.org/stdlib/libdoc/erb/rdoc/">ERB</a> 
	 * style client side templates.  Use them with controllers to easily build html and inject
	 * it into the DOM.
	 * 
	 * ###  Example
	 * 
	 * The following generates a list of tasks:
	 * 
	 * @codestart html
	 * &lt;ul>
	 * &lt;% for(var i = 0; i < tasks.length; i++){ %>
	 *     &lt;li class="task &lt;%= tasks[i].identity %>">&lt;%= tasks[i].name %>&lt;/li>
	 * &lt;% } %>
	 * &lt;/ul>
	 * @codeend
	 * 
	 * For the following examples, we assume this view is in <i>'views\tasks\list.ejs'</i>.
	 * 
	 * 
	 * ## Use
	 * 
	 * ### Loading and Rendering EJS:
	 * 
	 * You should use EJS through the helper functions [jQuery.View] provides such as:
	 * 
	 *   - [jQuery.fn.after after]
	 *   - [jQuery.fn.append append]
	 *   - [jQuery.fn.before before]
	 *   - [jQuery.fn.html html], 
	 *   - [jQuery.fn.prepend prepend],
	 *   - [jQuery.fn.replaceWith replaceWith], and 
	 *   - [jQuery.fn.text text].
	 * 
	 * or [jQuery.Controller.prototype.view].
	 * 
	 * ### Syntax
	 * 
	 * EJS uses 5 types of tags:
	 * 
	 *   - <code>&lt;% CODE %&gt;</code> - Runs JS Code.
	 *     For example:
	 *     
	 *         <% alert('hello world') %>
	 *     
	 *   - <code>&lt;%= CODE %&gt;</code> - Runs JS Code and writes the _escaped_ result into the result of the template.
	 *     For example:
	 *     
	 *         <h1><%= 'hello world' %></h1>
	 *         
	 *   - <code>&lt;%== CODE %&gt;</code> - Runs JS Code and writes the _unescaped_ result into the result of the template.
	 *     For example:
	 *     
	 *         <h1><%== '<span>hello world</span>' %></h1>
	 *         
	 *   - <code>&lt;%%= CODE %&gt;</code> - Writes <%= CODE %> to the result of the template.  This is very useful for generators.
	 *     
	 *         <%%= 'hello world' %>
	 *         
	 *   - <code>&lt;%# CODE %&gt;</code> - Used for comments.  This does nothing.
	 *     
	 *         <%# 'hello world' %>
	 *        
	 * ## Hooking up controllers
	 * 
	 * After drawing some html, you often want to add other widgets and plugins inside that html.
	 * View makes this easy.  You just have to return the Contoller class you want to be hooked up.
	 * 
	 * @codestart
	 * &lt;ul &lt;%= Mxui.Tabs%>>...&lt;ul>
	 * @codeend
	 * 
	 * You can even hook up multiple controllers:
	 * 
	 * @codestart
	 * &lt;ul &lt;%= [Mxui.Tabs, Mxui.Filler]%>>...&lt;ul>
	 * @codeend
	 * 
	 * <h2>View Helpers</h2>
	 * View Helpers return html code.  View by default only comes with 
	 * [jQuery.EJS.Helpers.prototype.view view] and [jQuery.EJS.Helpers.prototype.text text].
	 * You can include more with the view/helpers plugin.  But, you can easily make your own!
	 * Learn how in the [jQuery.EJS.Helpers Helpers] page.
	 * 
	 * @constructor Creates a new view
	 * @param {Object} options A hash with the following options
	 * <table class="options">
	 *     <tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
	 *     <tr>
	 *      <td>url</td>
	 *      <td>&nbsp;</td>
	 *      <td>loads the template from a file.  This path should be relative to <i>[jQuery.root]</i>.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>text</td>
	 *      <td>&nbsp;</td>
	 *      <td>uses the provided text as the template. Example:<br/><code>new View({text: '&lt;%=user%>'})</code>
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>element</td>
	 *      <td>&nbsp;</td>
	 *      <td>loads a template from the innerHTML or value of the element.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>type</td>
	 *      <td>'<'</td>
	 *      <td>type of magic tags.  Options are '&lt;' or '['
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>name</td>
	 *      <td>the element ID or url </td>
	 *      <td>an optional name that is used for caching.
	 *      </td>
	 *     </tr>
	 *     <tr>
	 *      <td>cache</td>
	 *      <td>true in production mode, false in other modes</td>
	 *      <td>true to cache template.
	 *      </td>
	 *     </tr>
	 *     
	 *    </tbody></table>
	 */
	$.EJS = EJS;
	/** 
	 * @Prototype
	 */
	EJS.prototype = {
		constructor: EJS,
		/**
		 * Renders an object with extra view helpers attached to the view.
		 * @param {Object} object data to be rendered
		 * @param {Object} extra_helpers an object with additonal view helpers
		 * @return {String} returns the result of the string
		 */
		render: function( object, extraHelpers ) {
			object = object || {};
			this._extra_helpers = extraHelpers;
			var v = new EJS.Helpers(object, extraHelpers || {});
			return this.template.process.call(object, object, v);
		}
	};
	/* @Static */


	EJS.
	/**
	 * Used to convert what's in &lt;%= %> magic tags to a string
	 * to be inserted in the rendered output.
	 * 
	 * Typically, it's a string, and the string is just inserted.  However,
	 * if it's a function or an object with a hookup method, it can potentially be 
	 * be ran on the element after it's inserted into the page.
	 * 
	 * This is a very nice way of adding functionality through the view.
	 * Usually this is done with [jQuery.EJS.Helpers.prototype.plugin]
	 * but the following fades in the div element after it has been inserted:
	 * 
	 * @codestart
	 * &lt;%= function(el){$(el).fadeIn()} %>
	 * @codeend
	 * 
	 * @param {String|Object|Function} input the value in between the
	 * write majic tags: &lt;%= %>
	 * @return {String} returns the content to be added to the rendered
	 * output.  The content is different depending on the type:
	 * 
	 *   * string - a bac
	 *   * foo - bar
	 */
	text = function( input ) {
		if ( typeof input == 'string' ) {
			return input;
		}
		if ( input === null || input === undefined ) {
			return '';
		}
		var hook = (input.hookup &&
		function( el, id ) {
			input.hookup.call(input, el, id);
		}) || (typeof input == 'function' && input) || (isArray(input) &&
		function( el, id ) {
			for ( var i = 0; i < input.length; i++ ) {
				var stub;
				stub = input[i].hookup ? input[i].hookup(el, id) : input[i](el, id);
			}
		});
		if ( hook ) {
			return "data-view-id='" + $.View.hookup(hook) + "'";
		}
		return input.toString ? input.toString() : "";
	};
	EJS.clean = function( text ) {
		//return sanatized text
		if ( typeof text == 'string' ) {
			return escapeHTML(text);
		} else if ( typeof text == 'number' ) {
			return text;
		} else {
			return EJS.text(text);
		}
	}
	//returns something you can call scan on
	var scan = function( scanner, source, block ) {
		var source_split = rSplit(source, /\n/),
			i = 0;
		for (; i < source_split.length; i++ ) {
			scanline(scanner, source_split[i], block);
		}

	},
		scanline = function( scanner, line, block ) {
			scanner.lines++;
			var line_split = rSplit(line, scanner.splitter),
				token;
			for ( var i = 0; i < line_split.length; i++ ) {
				token = line_split[i];
				if ( token !== null ) {
					block(token, scanner);
				}
			}
		},
		makeScanner = function( left, right ) {
			var scanner = {};
			extend(scanner, {
				left: left + '%',
				right: '%' + right,
				dLeft: left + '%%',
				dRight: '%%' + right,
				eeLeft: left + '%==',
				eLeft: left + '%=',
				cmnt: left + '%#',
				scan: scan,
				lines: 0
			});
			scanner.splitter = new RegExp("(" + [scanner.dLeft, scanner.dRight, scanner.eeLeft, scanner.eLeft, scanner.cmnt, scanner.left, scanner.right + '\n', scanner.right, '\n'].join(")|(").
			replace(/\[/g, "\\[").replace(/\]/g, "\\]") + ")");
			return scanner;
		},
		// compiles a template
		compile = function( source, left, name ) {
			source = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
			//normalize line endings
			left = left || '<';
			var put_cmd = "___v1ew.push(",
				insert_cmd = put_cmd,
				buff = new EJS.Buffer(['var ___v1ew = [];'], []),
				content = '',
				put = function( content ) {
					buff.push(put_cmd, '"', clean(content), '");');
				},
				startTag = null,
				empty = function() {
					content = ''
				};

			scan(makeScanner(left, left === '[' ? ']' : '>'), source || "", function( token, scanner ) {
				// if we don't have a start pair
				if ( startTag === null ) {
					switch ( token ) {
					case '\n':
						content = content + "\n";
						put(content);
						buff.cr();
						empty();
						break;
					case scanner.left:
					case scanner.eLeft:
					case scanner.eeLeft:
					case scanner.cmnt:
						startTag = token;
						if ( content.length > 0 ) {
							put(content);
						}
						empty();
						break;

						// replace <%% with <%
					case scanner.dLeft:
						content += scanner.left;
						break;
					default:
						content += token;
						break;
					}
				}
				else {
					switch ( token ) {
					case scanner.right:
						switch ( startTag ) {
						case scanner.left:
							if ( content[content.length - 1] == '\n' ) {
								content = chop(content);
								buff.push(content, ";");
								buff.cr();
							}
							else {
								buff.push(content, ";");
							}
							break;
						case scanner.eLeft:
							buff.push(insert_cmd, "(jQuery.EJS.clean(", content, ")));");
							break;
						case scanner.eeLeft:
							buff.push(insert_cmd, "(jQuery.EJS.text(", content, ")));");
							break;
						}
						startTag = null;
						empty();
						break;
					case scanner.dRight:
						content += scanner.right;
						break;
					default:
						content += token;
						break;
					}
				}
			})
			if ( content.length > 0 ) {
				// Should be content.dump in Ruby
				buff.push(put_cmd, '"', clean(content) + '");');
			}
			var template = buff.close(),
				out = {
					out: 'try { with(_VIEW) { with (_CONTEXT) {' + template + " return ___v1ew.join('');}}}catch(e){e.lineNumber=null;throw e;}"
				};
			//use eval instead of creating a function, b/c it is easier to debug
			myEval.call(out, 'this.process = (function(_CONTEXT,_VIEW){' + out.out + '});\r\n//@ sourceURL=' + name + ".js");
			return out;
		};


	// a line and script buffer
	// we use this so we know line numbers when there
	// is an error.  
	// pre and post are setup and teardown for the buffer
	EJS.Buffer = function( pre_cmd, post ) {
		this.line = [];
		this.script = [];
		this.post = post;

		// add the pre commands to the first line
		this.push.apply(this, pre_cmd);
	};
	EJS.Buffer.prototype = {
		//need to maintain your own semi-colons (for performance)
		push: function() {
			this.line.push.apply(this.line, arguments);
		},

		cr: function() {
			this.script.push(this.line.join(''), "\n");
			this.line = [];
		},
		//returns the script too
		close: function() {
			var stub;

			if ( this.line.length > 0 ) {
				this.script.push(this.line.join(''));
				this.line = [];
			}

			stub = this.post.length && this.push.apply(this, this.post);

			this.script.push(";"); //makes sure we always have an ending /
			return this.script.join("");
		}

	};


	//type, cache, folder
	/**
	 * @attribute options
	 * Sets default options for all views
	 * <table class="options">
	 * <tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
	 * <tr>
	 * <td>type</td>
	 * <td>'<'</td>
	 * <td>type of magic tags.  Options are '&lt;' or '['
	 * </td>
	 * </tr>
	 * <tr>
	 * <td>cache</td>
	 * <td>true in production mode, false in other modes</td>
	 * <td>true to cache template.
	 * </td>
	 * </tr>
	 * </tbody></table>
	 * 
	 */
	EJS.options = {
		type: '<',
		ext: '.ejs'
	};




	/**
	 * @class jQuery.EJS.Helpers
	 * @parent jQuery.EJS
	 * By adding functions to jQuery.EJS.Helpers.prototype, those functions will be available in the 
	 * views.
	 * 
	 * The following helper converts a given string to upper case:
	 * 
	 * 	$.EJS.Helpers.prototype.toUpper = function(params)
	 * 	{
	 * 		return params.toUpperCase();
	 * 	}
	 * 
	 * Use it like this in any EJS template:
	 * 
	 * 	<%= toUpper('javascriptmvc') %>
	 * 
	 * To access the current DOM element return a function that takes the element as a parameter:
	 * 
	 * 	$.EJS.Helpers.prototype.upperHtml = function(params)
	 * 	{
	 * 		return function(el) {
	 * 			$(el).html(params.toUpperCase());
	 * 		}
	 * 	}
	 * 
	 * In your EJS view you can then call the helper on an element tag:
	 * 
	 * 	<div <%= upperHtml('javascriptmvc') %>></div>
	 * 
	 * 
	 * @constructor Creates a view helper.  This function is called internally.  You should never call it.
	 * @param {Object} data The data passed to the view.  Helpers have access to it through this._data
	 */
	EJS.Helpers = function( data, extras ) {
		this._data = data;
		this._extras = extras;
		extend(this, extras);
	};
	/* @prototype*/
	EJS.Helpers.prototype = {
		/**
		 * Hooks up a jQuery plugin on.
		 * @param {String} name the plugin name
		 */
		plugin: function( name ) {
			var args = $.makeArray(arguments),
				widget = args.shift();
			return function( el ) {
				var jq = $(el);
				jq[widget].apply(jq, args);
			};
		},
		/**
		 * Renders a partial view.  This is deprecated in favor of <code>$.View()</code>.
		 */
		view: function( url, data, helpers ) {
			helpers = helpers || this._extras;
			data = data || this._data;
			return $.View(url, data, helpers); //new EJS(options).render(data, helpers);
		}
	};


	$.View.register({
		suffix: "ejs",
		//returns a function that renders the view
		script: function( id, src ) {
			return "jQuery.EJS(function(_CONTEXT,_VIEW) { " + new EJS({
				text: src,
				name: id
			}).template.out + " })";
		},
		renderer: function( id, text ) {
			var ejs = new EJS({
				text: text,
				name: id
			});
			return function( data, helpers ) {
				return ejs.render.call(ejs, data, helpers);
			};
		}
	});
})(jQuery);

//jquery.view.jaml.js

(function(){
	


/**
 * @class Jaml
 * @plugin jquery/view/jaml
 * @parent jQuery.View
 * @author Ed Spencer (http://edspencer.net)
 * Jaml is a simple JavaScript library which makes 
 * HTML generation easy and pleasurable.
 * 
 * Instead of magic tags, Jaml is pure JS.  It looks like:
 * 
 * @codestart
 * function(data) {
 *   h3(data.message);
 * }
 * @codeend
 * 
 * Jaml is integrated into jQuery.View so you can use it like:
 * 
 * @codestart
 * $("#foo").html('//app/views/template.jaml',{});
 * @codeend
 * 
 * ## Use
 * 
 * For more info check out:
 * 
 *  - [http://edspencer.net/2009/11/jaml-beautiful-html-generation-for-javascript.html introduction]
 *  - [http://edspencer.github.com/jaml examples]
 * 
 */
Jaml = function() {
  return {
    templates: {},
    helpers  : {},
    
    /**
     * Registers a template by name
     * @param {String} name The name of the template
     * @param {Function} template The template function
     */
    register: function(name, template ) {
      this.templates[name] = template;
    },
    
    /**
     * Renders the given template name with an optional data object
     * @param {String} name The name of the template to render
     * @param {Object} data Optional data object
     */
    render: function(name, data ) {
      var template = this.templates[name],
          renderer = new Jaml.Template(template);
          
      return renderer.render(data);
    },
    
    /**
     * Registers a helper function
     * @param {String} name The name of the helper
     * @param {Function} helperFn The helper function
     */
    registerHelper: function(name, helperFn ) {
      this.helpers[name] = helperFn;
    }
  };
}();



/**
 * @class
 * @constructor
 * @param {String} tagName The tag name this node represents (e.g. 'p', 'div', etc)
 */
Jaml.Node = function(tagName) {
  /**
   * @attribute tagName
   * @type String
   * This node's current tag
   */
  this.tagName = tagName;
  
  /**
   * @attribute attributes
   * @type Object
   * Sets of attributes on this node (e.g. 'cls', 'id', etc)
   */
  this.attributes = {};
  
  /**
   * @attribute children
   * @type Array
   * Array of rendered child nodes that will be steald as this node's innerHTML
   */
  this.children = [];
};

Jaml.Node.prototype = {
  /**
   * Adds attributes to this node
   * @param {Object} attrs Object containing key: value pairs of node attributes
   */
  setAttributes: function(attrs ) {
    for (var key in attrs) {
      //convert cls to class
      var mappedKey = key == 'cls' ? 'class' : key;
      
      this.attributes[mappedKey] = attrs[key];
    }
  },
  
  /**
   * Adds a child string to this node. This can be called as often as needed to add children to a node
   * @param {String} childText The text of the child node
   */
  addChild: function(childText ) {
    this.children.push(childText);
  },
  
  /**
   * Renders this node with its attributes and children
   * @param {Number} lpad Amount of whitespace to add to the left of the string (defaults to 0)
   * @return {String} The rendered node
   */
  render: function(lpad ) {
    lpad = lpad || 0;
    
    var node      = [],
        attrs     = [],
        textnode  = (this instanceof Jaml.TextNode),
        multiline = this.multiLineTag();
    
    for (var key in this.attributes) {
      attrs.push(key + '=' + this.attributes[key]);
    }
    
    //add any left padding
    if (!textnode) node.push(this.getPadding(lpad));
    
    //open the tag
    node.push("<" + this.tagName);
    
    //add any tag attributes
    for (var key in this.attributes) {
      node.push(" " + key + "=\"" + this.attributes[key] + "\"");
    }
    
    if (this.isSelfClosing()) {
      node.push(" />\n");
    } else {
      node.push(">");
      
      if (multiline) node.push("\n");
      
      for (var i=0; i < this.children.length; i++) {
        node.push(this.children[i].render(lpad + 2));
      }
      
      if (multiline) node.push(this.getPadding(lpad));
      node.push("</", this.tagName, ">\n");
    }
    
    return node.join("");
  },
  
  /**
   * Returns true if this tag should be rendered with multiple newlines (e.g. if it contains child nodes)
   * @return {Boolean} True to render this tag as multi-line
   */
  multiLineTag: function() {
    var childLength = this.children.length,
        multiLine   = childLength > 0;
    
    if (childLength == 1 && this.children[0] instanceof Jaml.TextNode) multiLine = false;
    
    return multiLine;
  },
  
  /**
   * Returns a string with the given number of whitespace characters, suitable for padding
   * @param {Number} amount The number of whitespace characters to add
   * @return {String} A padding string
   */
  getPadding: function(amount ) {
    return new Array(amount + 1).join(" ");
  },
  
  /**
   * Returns true if this tag should close itself (e.g. no </tag> element)
   * @return {Boolean} True if this tag should close itself
   */
  isSelfClosing: function() {
    var selfClosing = false;
    
    for (var i = this.selfClosingTags.length - 1; i >= 0; i--){
      if (this.tagName == this.selfClosingTags[i]) selfClosing = true;
    }
    
    return selfClosing;
  },
  
  /**
   * @attribute selfClosingTags
   * @type Array
   * An array of all tags that should be self closing
   */
  selfClosingTags: ['img', 'meta', 'br', 'hr']
};

Jaml.TextNode = function(text) {
  this.text = text;
};

Jaml.TextNode.prototype = {
  render: function() {
    return this.text;
  }
};

/**
 * Represents a single registered template. Templates consist of an arbitrary number
 * of trees (e.g. there may be more than a single root node), and are not compiled.
 * When a template is rendered its node structure is computed with any provided template
 * data, culminating in one or more root nodes.  The root node(s) are then joined together
 * and returned as a single output string.
 * 
 * The render process uses two dirty but necessary hacks.  First, the template function is
 * decompiled into a string (but is not modified), so that it can be eval'ed within the scope
 * of Jaml.Template.prototype. This allows the second hack, which is the use of the 'with' keyword.
 * This allows us to keep the pretty DSL-like syntax, though is not as efficient as it could be.
 */
Jaml.Template = function(tpl) {
  /**
   * @attribute tpl
   * @type Function
   * The function this template was created from
   */
  this.tpl = tpl;
  
  this.nodes = [];
};

Jaml.Template.prototype = {
  /**
   * Renders this template given the supplied data
   * @param {Object} data Optional data object
   * @return {String} The rendered HTML string
   */
  render: function(data ) {
    data = data || {};
    
    //the 'data' argument can come in two flavours - array or non-array. Normalise it
    //here so that it always looks like an array.
    if (data.constructor.toString().indexOf("Array") == -1) {
      data = [data];
    }
    
    with(this) {
      for (var i=0; i < data.length; i++) {
        eval("(" + this.tpl.toString() + ")(data[i])");
      };
    }
    
    var roots  = this.getRoots(),
        output = "";
    
    for (var i=0; i < roots.length; i++) {
      output += roots[i].render();
    };
    
    return output;
  },
  
  /**
   * Returns all top-level (root) nodes in this template tree.
   * Templates are tree structures, but there is no guarantee that there is a
   * single root node (e.g. a single DOM element that all other elements nest within)
   * @return {Array} The array of root nodes
   */
  getRoots: function() {
    var roots = [];
    
    for (var i=0; i < this.nodes.length; i++) {
      var node = this.nodes[i];
      
      if (node.parent == undefined) roots.push(node);
    };
    
    return roots;
  },
  
  tags: [
    "html", "head", "body", "script", "meta", "title", "link", "script",
    "div", "p", "span", "a", "img", "br", "hr",
    "table", "tr", "th", "td", "thead", "tbody",
    "ul", "ol", "li", 
    "dl", "dt", "dd",
    "h1", "h2", "h3", "h4", "h5", "h6", "h7",
    "form", "input", "label"
  ]
};

/**
 * Adds a function for each tag onto Template's prototype
 */
(function() {
  var tags = Jaml.Template.prototype.tags;
  
  for (var i = tags.length - 1; i >= 0; i--){
    var tagName = tags[i];
    
    /**
     * This function is created for each tag name and assigned to Template's
     * prototype below
     */
    var fn = function(tagName) {
      return function(attrs) {
        var node = new Jaml.Node(tagName);
        
        var firstArgIsAttributes =  (typeof attrs == 'object')
                                 && !(attrs instanceof Jaml.Node)
                                 && !(attrs instanceof Jaml.TextNode);

        if (firstArgIsAttributes) node.setAttributes(attrs);

        var startIndex = firstArgIsAttributes ? 1 : 0;

        for (var i=startIndex; i < arguments.length; i++) {
          var arg = arguments[i];

          if (typeof arg == "string" || arg == undefined) {
            arg = new Jaml.TextNode(arg || "");
          }
          
          if (arg instanceof Jaml.Node || arg instanceof Jaml.TextNode) {
            arg.parent = node;
          }

          node.addChild(arg);
        };
        
        this.nodes.push(node);
        
        return node;
      };
    };
    
    Jaml.Template.prototype[tagName] = fn(tagName);
  };
})();

$.View.register({
	suffix : "jaml",
	script: function(id, str ) {
		return "((function(){ Jaml.register("+id+", "+str+"); return function(data){return Jaml.render("+id+", data)} })())"
	},
	renderer: function(id, text ) {
		var func;
		eval("func = ("+text+")");
		Jaml.register(id, func);
		return function(data){
			return Jaml.render(id, data)
		}
	}
})


})(jQuery);

//jquery.view.micro.js

(function(){
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed

  var cache = {};
  /**
   * @function Micro
   * @parent jQuery.View
   * @plugin jquery/view/micro
   * A very lightweight template engine. 
   * Magic tags look like:
   * 
   * @codestart
   * <h3>{%= message %}</h3>
   * @codeend
   * 
   * Micro is integrated in JavaScriptMVC so 
   * you can use it like:
   * 
   * @codestart
   * $("#foo").html('//app/views/bar.micro',{});
   * @codeend
   * 
   * ## Pros
   * 
   *  - Very Lightweight
   *  
   * ## Cons
   * 
   *  - Doesn't handle nested tags.
   *  - Doesn't handle {%= "%}" %}. 
   *  - More difficult to debug.
   *  - Removes newlines and tabs.
   * 
   * ## Use
   * 
   * For more information on micro, see John Resig's
   * [http://ejohn.org/blog/javascript-micro-templating/ write up].
   * 
   * @param {String} str template content.
   * @param {Object} data render's the template with this content.
   */
  function Micro(str, data){
	var body =  
		"var p=[],print=function(){p.push.apply(p,arguments);};" +
        
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        
        // Convert the template into pure JavaScript
        str.replace(/[\r\t\n]/g, " ")
   .replace(/'(?=[^%]*%})/g,"\t")
   .split("'").join("\\'")
   .split("\t").join("'")
   .replace(/{%=(.+?)%}/g, "',$1,'")
   .split("{%").join("');")
   .split("%}").join("p.push('")+ "');}return p.join('');"
	
    var fn =  new Function("obj",body);
	fn.body = body;
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };

	$.View.register({
		suffix : "micro",
		renderer: function( id, text ) {
			var mt = Micro(text)
			return function(data){
				return mt(data)
			}
		},
		script: function( id, str ) {
			return "function(obj){"+Micro(str).body+"}";
		}
	})
	jQuery.View.ext = ".micro"
	

})(jQuery);

//jquery.view.tmpl.js

(function(){
		// Override the DOM manipulation function
	var oldManip = jQuery.fn.domManip, tmplItmAtt = "_tmplitem", htmlExpr = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
		newTmplItems = {}, wrappedItems = {}, appendToTmplItems, topTmplItem = { key: 0, data: {} }, itemKey = 0, cloneIndex = 0, stack = [];

	function newTmplItem( options, parentItem, fn, data ) {
		// Returns a template item data structure for a new rendered instance of a template (a 'template item').
		// The content field is a hierarchical array of strings and nested items (to be
		// removed and replaced by nodes field of dom elements, once inserted in DOM).
		var newItem = {
			data: data || (parentItem ? parentItem.data : {}),
			_wrap: parentItem ? parentItem._wrap : null,
			tmpl: null,
			parent: parentItem || null,
			nodes: [],
			calls: tiCalls,
			nest: tiNest,
			wrap: tiWrap,
			html: tiHtml,
			update: tiUpdate
		};
		if ( options ) {
			jQuery.extend( newItem, options, { nodes: [], parent: parentItem } );
		}
		if ( fn ) {
			// Build the hierarchical content to be used during insertion into DOM
			newItem.tmpl = fn;
			newItem._ctnt = newItem._ctnt || newItem.tmpl( jQuery, newItem );
			newItem.key = ++itemKey;
			// Keep track of new template item, until it is stored as jQuery Data on DOM element
			(stack.length ? wrappedItems : newTmplItems)[itemKey] = newItem;
		}
		return newItem;
	}

	// Override appendTo etc., in order to provide support for targeting multiple elements. (This code would disappear if integrated in jquery core).
	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var ret = [], insert = jQuery( selector ), elems, i, l, tmplItems,
				parent = this.length === 1 && this[0].parentNode;

			appendToTmplItems = newTmplItems || {};
			if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
				insert[ original ]( this[0] );
				ret = this;
			} else {
				for ( i = 0, l = insert.length; i < l; i++ ) {
					cloneIndex = i;
					elems = (i > 0 ? this.clone(true) : this).get();
					jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
					ret = ret.concat( elems );
				}
				cloneIndex = 0;
				ret = this.pushStack( ret, name, insert.selector );
			}
			tmplItems = appendToTmplItems;
			appendToTmplItems = null;
			jQuery.tmpl.complete( tmplItems );
			return ret;
		};
	});

	jQuery.fn.extend({
		// Use first wrapped element as template markup.
		// Return wrapped set of template items, obtained by rendering template against data.
		tmpl: function( data, options, parentItem ) {
			return jQuery.tmpl( this[0], data, options, parentItem );
		},

		// Find which rendered template item the first wrapped DOM element belongs to
		tmplItem: function() {
			return jQuery.tmplItem( this[0] );
		},

		// Consider the first wrapped element as a template declaration, and get the compiled template or store it as a named template.
		template: function( name ) {
			return jQuery.template( name, this[0] );
		},

		domManip: function( args, table, callback, options ) {
			// This appears to be a bug in the appendTo, etc. implementation
			// it should be doing .call() instead of .apply(). See #6227
			if ( args[0] && args[0].nodeType ) {
				var dmArgs = jQuery.makeArray( arguments ), argsLength = args.length, i = 0, tmplItem;
				while ( i < argsLength && !(tmplItem = jQuery.data( args[i++], "tmplItem" ))) {}
				if ( argsLength > 1 ) {
					dmArgs[0] = [jQuery.makeArray( args )];
				}
				if ( tmplItem && cloneIndex ) {
					dmArgs[2] = function( fragClone ) {
						// Handler called by oldManip when rendered template has been inserted into DOM.
						jQuery.tmpl.afterManip( this, fragClone, callback );
					};
				}
				oldManip.apply( this, dmArgs );
			} else {
				oldManip.apply( this, arguments );
			}
			cloneIndex = 0;
			if ( !appendToTmplItems ) {
				jQuery.tmpl.complete( newTmplItems );
			}
			return this;
		}
	});

	jQuery.extend({
		// Return wrapped set of template items, obtained by rendering template against data.
		tmpl: function( tmpl, data, options, parentItem ) {
			var ret, topLevel = !parentItem;
			if ( topLevel ) {
				// This is a top-level tmpl call (not from a nested template using {{tmpl}})
				parentItem = topTmplItem;
				tmpl = jQuery.template[tmpl] || jQuery.template( null, tmpl );
				wrappedItems = {}; // Any wrapped items will be rebuilt, since this is top level
			} else if ( !tmpl ) {
				// The template item is already associated with DOM - this is a refresh.
				// Re-evaluate rendered template for the parentItem
				tmpl = parentItem.tmpl;
				newTmplItems[parentItem.key] = parentItem;
				parentItem.nodes = [];
				if ( parentItem.wrapped ) {
					updateWrapped( parentItem, parentItem.wrapped );
				}
				// Rebuild, without creating a new template item
				return jQuery( build( parentItem, null, parentItem.tmpl( jQuery, parentItem ) ));
			}
			if ( !tmpl ) {
				return []; // Could throw...
			}
			if ( typeof data === "function" ) {
				data = data.call( parentItem || {} );
			}
			if ( options && options.wrapped ) {
				updateWrapped( options, options.wrapped );
			}
			ret = jQuery.isArray( data ) ? 
				jQuery.map( data, function( dataItem ) {
					return dataItem ? newTmplItem( options, parentItem, tmpl, dataItem ) : null;
				}) :
				[ newTmplItem( options, parentItem, tmpl, data ) ];
			return topLevel ? jQuery( build( parentItem, null, ret ) ) : ret;
		},

		// Return rendered template item for an element.
		tmplItem: function( elem ) {
			var tmplItem;
			if ( elem instanceof jQuery ) {
				elem = elem[0];
			}
			while ( elem && elem.nodeType === 1 && !(tmplItem = jQuery.data( elem, "tmplItem" )) && (elem = elem.parentNode) ) {}
			return tmplItem || topTmplItem;
		},

		// Set:
		// Use $.template( name, tmpl ) to cache a named template,
		// where tmpl is a template string, a script element or a jQuery instance wrapping a script element, etc.
		// Use $( "selector" ).template( name ) to provide access by name to a script block template declaration.

		// Get:
		// Use $.template( name ) to access a cached template.
		// Also $( selectorToScriptBlock ).template(), or $.template( null, templateString )
		// will return the compiled template, without adding a name reference.
		// If templateString includes at least one HTML tag, $.template( templateString ) is equivalent
		// to $.template( null, templateString )
		template: function( name, tmpl ) {
			if (tmpl) {
				// Compile template and associate with name
				if ( typeof tmpl === "string" ) {
					// This is an HTML string being passed directly in.
					tmpl = buildTmplFn( tmpl )
				} else if ( tmpl instanceof jQuery ) {
					tmpl = tmpl[0] || {};
				}
				if ( tmpl.nodeType ) {
					// If this is a template block, use cached copy, or generate tmpl function and cache.
					tmpl = jQuery.data( tmpl, "tmpl" ) || jQuery.data( tmpl, "tmpl", buildTmplFn( tmpl.innerHTML ));
				}
				return typeof name === "string" ? (jQuery.template[name] = tmpl) : tmpl;
			}
			// Return named compiled template
			return name ? (typeof name !== "string" ? jQuery.template( null, name ): 
				(jQuery.template[name] || 
					// If not in map, treat as a selector. (If integrated with core, use quickExpr.exec) 
					jQuery.template( null, htmlExpr.test( name ) ? name : jQuery( name )))) : null; 
		},

		encode: function( text ) {
			// Do HTML encoding replacing < > & and ' and " by corresponding entities.
			return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
		}
	});

	jQuery.extend( jQuery.tmpl, {
		tag: {
			"tmpl": {
				_default: { $2: "null" },
				open: "if($notnull_1){_=_.concat($item.nest($1,$2));}"
				// tmpl target parameter can be of type function, so use $1, not $1a (so not auto detection of functions)
				// This means that {{tmpl foo}} treats foo as a template (which IS a function). 
				// Explicit parens can be used if foo is a function that returns a template: {{tmpl foo()}}.
			},
			"wrap": {
				_default: { $2: "null" },
				open: "$item.calls(_,$1,$2);_=[];",
				close: "call=$item.calls();_=call._.concat($item.wrap(call,_));"
			},
			"each": {
				_default: { $2: "$index, $value" },
				open: "if($notnull_1){$.each($1a,function($2){with(this){",
				close: "}});}"
			},
			"if": {
				open: "if(($notnull_1) && $1a){",
				close: "}"
			},
			"else": {
				_default: { $1: "true" },
				open: "}else if(($notnull_1) && $1a){"
			},
			"html": {
				// Unecoded expression evaluation. 
				open: "if($notnull_1){_.push($1a);}"
			},
			"=": {
				// Encoded expression evaluation. Abbreviated form is ${}.
				_default: { $1: "$data" },
				open: "if($notnull_1){_.push($.encode($1a));}"
			},
			"!": {
				// Comment tag. Skipped by parser
				open: ""
			}
		},

		// This stub can be overridden, e.g. in jquery.tmplPlus for providing rendered events
		complete: function( items ) {
			newTmplItems = {};
		},

		// Call this from code which overrides domManip, or equivalent
		// Manage cloning/storing template items etc.
		afterManip: function afterManip( elem, fragClone, callback ) {
			// Provides cloned fragment ready for fixup prior to and after insertion into DOM
			var content = fragClone.nodeType === 11 ?
				jQuery.makeArray(fragClone.childNodes) :
				fragClone.nodeType === 1 ? [fragClone] : [];

			// Return fragment to original caller (e.g. append) for DOM insertion
			callback.call( elem, fragClone );

			// Fragment has been inserted:- Add inserted nodes to tmplItem data structure. Replace inserted element annotations by jQuery.data.
			storeTmplItems( content );
			cloneIndex++;
		}
	});

	//========================== Private helper functions, used by code above ==========================

	function build( tmplItem, nested, content ) {
		// Convert hierarchical content into flat string array 
		// and finally return array of fragments ready for DOM insertion
		var frag, ret = content ? jQuery.map( content, function( item ) {
			return (typeof item === "string") ? 
				// Insert template item annotations, to be converted to jQuery.data( "tmplItem" ) when elems are inserted into DOM.
				(tmplItem.key ? item.replace( /(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + tmplItmAtt + "=\"" + tmplItem.key + "\" $2" ) : item) :
				// This is a child template item. Build nested template.
				build( item, tmplItem, item._ctnt );
		}) : 
		// If content is not defined, insert tmplItem directly. Not a template item. May be a string, or a string array, e.g. from {{html $item.html()}}. 
		tmplItem;
		if ( nested ) {
			return ret;
		}

		// top-level template
		ret = ret.join("");

		// Support templates which have initial or final text nodes, or consist only of text
		// Also support HTML entities within the HTML markup.
		ret.replace( /^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function( all, before, middle, after) {
			frag = jQuery( middle ).get();

			storeTmplItems( frag );
			if ( before ) {
				frag = unencode( before ).concat(frag);
			}
			if ( after ) {
				frag = frag.concat(unencode( after ));
			}
		});
		return frag ? frag : unencode( ret );
	}

	function unencode( text ) {
		// Use createElement, since createTextNode will not render HTML entities correctly
		var el = document.createElement( "div" );
		el.innerHTML = text;
		return jQuery.makeArray(el.childNodes);
	}

	// Generate a reusable function that will serve to render a template against data
	function buildTmplFn( markup ) {
		return new Function("jQuery","$item",
			"var $=jQuery,call,_=[],$data=$item.data;" +

			// Introduce the data as local variables using with(){}
			"with($data){_.push('" +

			// Convert the template into pure JavaScript
			jQuery.trim(markup)
				.replace( /([\\'])/g, "\\$1" )
				.replace( /[\r\t\n]/g, " " )
				.replace( /\$\{([^\}]*)\}/g, "{{= $1}}" )
				.replace( /\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,
				function( all, slash, type, fnargs, target, parens, args ) {
					var tag = jQuery.tmpl.tag[ type ], def, expr, exprAutoFnDetect;
					if ( !tag ) {
						throw "Template command not found: " + type;
					}
					def = tag._default || [];
					if ( parens && !/\w$/.test(target)) {
						target += parens;
						parens = "";
					}
					if ( target ) {
						target = unescape( target ); 
						args = args ? ("," + unescape( args ) + ")") : (parens ? ")" : "");
						// Support for target being things like a.toLowerCase();
						// In that case don't call with template item as 'this' pointer. Just evaluate...
						expr = parens ? (target.indexOf(".") > -1 ? target + parens : ("(" + target + ").call($item" + args)) : target;
						exprAutoFnDetect = parens ? expr : "(typeof(" + target + ")==='function'?(" + target + ").call($item):(" + target + "))";
					} else {
						exprAutoFnDetect = expr = def.$1 || "null";
					}
					fnargs = unescape( fnargs );
					return "');" + 
						tag[ slash ? "close" : "open" ]
							.split( "$notnull_1" ).join( target ? "typeof(" + target + ")!=='undefined' && (" + target + ")!=null" : "true" )
							.split( "$1a" ).join( exprAutoFnDetect )
							.split( "$1" ).join( expr )
							.split( "$2" ).join( fnargs ?
								fnargs.replace( /\s*([^\(]+)\s*(\((.*?)\))?/g, function( all, name, parens, params ) {
									params = params ? ("," + params + ")") : (parens ? ")" : "");
									return params ? ("(" + name + ").call($item" + params) : all;
								})
								: (def.$2||"")
							) +
						"_.push('";
				}) +
			"');}return _;"
		);
	}
	function updateWrapped( options, wrapped ) {
		// Build the wrapped content. 
		options._wrap = build( options, true, 
			// Suport imperative scenario in which options.wrapped can be set to a selector or an HTML string.
			jQuery.isArray( wrapped ) ? wrapped : [htmlExpr.test( wrapped ) ? wrapped : jQuery( wrapped ).html()]
		).join("");
	}

	function unescape( args ) {
		return args ? args.replace( /\\'/g, "'").replace(/\\\\/g, "\\" ) : null;
	}
	function outerHtml( elem ) {
		var div = document.createElement("div");
		div.appendChild( elem.cloneNode(true) );
		return div.innerHTML;
	}

	// Store template items in jQuery.data(), ensuring a unique tmplItem data data structure for each rendered template instance.
	function storeTmplItems( content ) {
		var keySuffix = "_" + cloneIndex, elem, elems, newClonedItems = {}, i, l, m;
		for ( i = 0, l = content.length; i < l; i++ ) {
			if ( (elem = content[i]).nodeType !== 1 ) {
				continue;
			}
			elems = elem.getElementsByTagName("*");
			for ( m = elems.length - 1; m >= 0; m-- ) {
				processItemKey( elems[m] );
			}
			processItemKey( elem );
		}
		function processItemKey( el ) {
			var pntKey, pntNode = el, pntItem, tmplItem, key;
			// Ensure that each rendered template inserted into the DOM has its own template item,
			if ( (key = el.getAttribute( tmplItmAtt ))) {
				while ( pntNode.parentNode && (pntNode = pntNode.parentNode).nodeType === 1 && !(pntKey = pntNode.getAttribute( tmplItmAtt ))) { }
				if ( pntKey !== key ) {
					// The next ancestor with a _tmplitem expando is on a different key than this one.
					// So this is a top-level element within this template item
					// Set pntNode to the key of the parentNode, or to 0 if pntNode.parentNode is null, or pntNode is a fragment.
					pntNode = pntNode.parentNode ? (pntNode.nodeType === 11 ? 0 : (pntNode.getAttribute( tmplItmAtt ) || 0)) : 0;
					if ( !(tmplItem = newTmplItems[key]) ) {
						// The item is for wrapped content, and was copied from the temporary parent wrappedItem.
						tmplItem = wrappedItems[key];
						tmplItem = newTmplItem( tmplItem, newTmplItems[pntNode]||wrappedItems[pntNode], null, true );
						tmplItem.key = ++itemKey;
						newTmplItems[itemKey] = tmplItem;
					}
					if ( cloneIndex ) {
						cloneTmplItem( key );
					}
				}
				el.removeAttribute( tmplItmAtt );
			} else if ( cloneIndex && (tmplItem = jQuery.data( el, "tmplItem" )) ) {
				// This was a rendered element, cloned during append or appendTo etc.
				// TmplItem stored in jQuery data has already been cloned in cloneCopyEvent. We must replace it with a fresh cloned tmplItem.
				cloneTmplItem( tmplItem.key );
				newTmplItems[tmplItem.key] = tmplItem;
				pntNode = jQuery.data( el.parentNode, "tmplItem" );
				pntNode = pntNode ? pntNode.key : 0;
			}
			if ( tmplItem ) {
				pntItem = tmplItem;
				// Find the template item of the parent element. 
				// (Using !=, not !==, since pntItem.key is number, and pntNode may be a string)
				while ( pntItem && pntItem.key != pntNode ) { 
					// Add this element as a top-level node for this rendered template item, as well as for any
					// ancestor items between this item and the item of its parent element
					pntItem.nodes.push( el );
					pntItem = pntItem.parent;
				}
				// Delete content built during rendering - reduce API surface area and memory use, and avoid exposing of stale data after rendering...
				delete tmplItem._ctnt;
				delete tmplItem._wrap;
				// Store template item as jQuery data on the element
				jQuery.data( el, "tmplItem", tmplItem );
			}
			function cloneTmplItem( key ) {
				key = key + keySuffix;
				tmplItem = newClonedItems[key] = 
					(newClonedItems[key] || newTmplItem( tmplItem, newTmplItems[tmplItem.parent.key + keySuffix] || tmplItem.parent, null, true ));
			}
		}
	}

	//---- Helper functions for template item ----

	function tiCalls( content, tmpl, data, options ) {
		if ( !content ) {
			return stack.pop();
		}
		stack.push({ _: content, tmpl: tmpl, item:this, data: data, options: options });
	}

	function tiNest( tmpl, data, options ) {
		// nested template, using {{tmpl}} tag
		return jQuery.tmpl( jQuery.template( tmpl ), data, options, this );
	}

	function tiWrap( call, wrapped ) {
		// nested template, using {{wrap}} tag
		var options = call.options || {};
		options.wrapped = wrapped;
		// Apply the template, which may incorporate wrapped content, 
		return jQuery.tmpl( jQuery.template( call.tmpl ), call.data, options, call.item );
	}

	function tiHtml( filter, textOnly ) {
		var wrapped = this._wrap;
		return jQuery.map(
			jQuery( jQuery.isArray( wrapped ) ? wrapped.join("") : wrapped ).filter( filter || "*" ),
			function(e) {
				return textOnly ?
					e.innerText || e.textContent :
					e.outerHTML || outerHtml(e);
			});
	}

	function tiUpdate() {
		var coll = this.nodes;
		jQuery.tmpl( null, null, null, this).insertBefore( coll[0] );
		jQuery( coll ).remove();
	}
	
	$.View.register({
		suffix : "tmpl",
		renderer: function( id, text ) {
			var tmpl = $.template( null, text );
			return function(data){
				return tmpl.call($, $, {data: data}).join('');
				//$(text).tmpl(data);//jQuery.render( text, data );
			};
		},
		script: function( id, str ) {
			var tmpl = $.template( null, str );
			return "function(data){return ("+tmpl+").call(jQuery, jQuery, {data: data}).join(''); }";
		}
	})
	jQuery.View.ext = ".tmpl"
})(jQuery);

//jquery.lang.json.js

(function($){
    /**
     * @page jQuery.toJSON jQuery.toJSON
     * @parent jquerymx.lang
     * 
     *     jQuery.toJSON( json-serializble )
     * 
     * Converts the given argument into a JSON respresentation.
     * 
     * If an object has a "toJSON" function, that will 
     * be used to get the representation.
     * Non-integer/string keys are skipped in the 
     * object, as are keys that point to a function.
     * 
     * json-serializble:
     * The *thing* to be converted.
     */
    $.toJSON = function(o, replacer, space, recurse)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o, replacer, space);

        if (!recurse && $.isFunction(replacer))
            o = replacer("", o);

        if (typeof space == "number")
            space = "          ".substring(0, space);
        space = (typeof space == "string") ? space.substring(0, 10) : "";
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined" || type == "function")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON(), replacer, space, true );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            var process = ($.isFunction(replacer)) ?
                function (k, v) { return replacer(k, v); } :
                function (k, v) { return v; },
                nl = (space) ? "\n" : "",
                sp = (space) ? " " : "";

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push(( $.toJSON( process(i, o[i]), replacer, space, true ) || "null" ).replace(/^/gm, space));

                return "[" + nl + ret.join("," + nl) + nl + "]";
            }
        
            var pairs = [], proplist;
            if ($.isArray(replacer)) {
                proplist = $.map(replacer, function (v) {
                    return (typeof v == "string" || typeof v == "number") ?
                        v + "" :
                        null;
                });
            }
            for (var k in o) {
                var name, val, type = typeof k;

                if (proplist && $.inArray(k + "", proplist) == -1)
                    continue;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                val = $.toJSON( process(k, o[k]), replacer, space, true );
            
                if (typeof val == "undefined")
                    continue;  //skip pairs where the value is a function.
            
                pairs.push((name + ":" + sp + val).replace(/^/gm, space));
            }

            return "{" + nl + pairs.join("," + nl) + nl + "}";
        }
    };

    /** 
     * @function jQuery.evalJSON
     * Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    /** 
     * @function jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     **/
    $.secureEvalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** 
     * @function jQuery.quoteString
     * 
     * Returns a string-repr of a string, escaping quotes intelligently.  
     * Mostly a support function for toJSON.
     * 
     * Examples:
     * 
     *      jQuery.quoteString("apple") //-> "apple"
     * 
     *      jQuery.quoteString('"Where are we going?", she asked.')
     *        // -> "\"Where are we going?\", she asked."
     **/
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
})(jQuery);

//jquery.dom.cookie.js

(function() {
    // break
    /**
     * @function jQuery.cookie
     * @parent dom
     * @plugin jquery/dom/cookie
     * @author Klaus Hartl/klaus.hartl@stilbuero.de
     *
     *  JavaScriptMVC's packaged cookie plugin is written by
     *  Klaus Hartl (stilbuero.de)<br />
	 *  Dual licensed under the MIT and GPL licenses:<br />
	 *  http://www.opensource.org/licenses/mit-license.php<br />
	 *  http://www.gnu.org/licenses/gpl.html
	 *  </p>
	 *  <p>
	 *  Create a cookie with the given name and value and other optional parameters.
	 *  / Get the value of a cookie with the given name.
	 *  </p>
	 *  <h3>Quick Examples</h3>
	 * 
	 *  Set the value of a cookie.
	 *  
	 *     $.cookie('the_cookie', 'the_value');
	 * 
	 *  Create a cookie with all available options.
	 *  @codestart
	 *  $.cookie('the_cookie', 'the_value',
	 *  { expires: 7, path: '/', domain: 'jquery.com', secure: true });
	 *  @codeend
	 * 
	 *  Create a session cookie.
	 *  @codestart
	 *  $.cookie('the_cookie', 'the_value');
	 *  @codeend
	 * 
	 *  Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
	 *  used when the cookie was set.
	 *  @codestart
	 *  $.cookie('the_cookie', null);
	 *  @codeend
	 * 
	 *  Get the value of a cookie.
	 *  @codestart
	 *  $.cookie('the_cookie');
	 *  @codeend
	 * 
     *
     * @param {String} [name] The name of the cookie.
     * @param {String} [value] The value of the cookie.
     * @param {Object} [options] An object literal containing key/value pairs to provide optional cookie attributes.<br />
     * @param {Number|Date} [expires] Either an integer specifying the expiration date from now on in days or a Date object.
     *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
     *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
     *                             when the the browser exits.<br />
     * @param {String} [path] The value of the path atribute of the cookie (default: path of page that created the cookie).<br />
     * @param {String} [domain] The value of the domain attribute of the cookie (default: domain of page that created the cookie).<br />
     * @param {Boolean} secure If true, the secure attribute of the cookie will be set and the cookie transmission will
     *                        require a secure protocol (like HTTPS).<br />
     * @return {String} the value of the cookie or {undefined} when setting the cookie.
     */
    jQuery.cookie = function(name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options ||
            {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            if (typeof value == 'object' && jQuery.toJSON) {
                value = jQuery.toJSON(value);
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            if (jQuery.evalJSON && cookieValue && cookieValue.match(/^\s*\{/)) {
                try {
                    cookieValue = jQuery.evalJSON(cookieValue);
                }
                catch (e) {
                }
            }
            return cookieValue;
        }
    };

})(jQuery);

//jquery.dom.dimensions.js

(function($) {
/**
 * @page dimensions dimensions
 * @parent dom
 * @plugin jquery/dom/dimensions
 * 
 * The dimensions plugin adds support for setting+animating inner+outer height and widths.
 * 
 * ### Quick Examples
 * 
 *      $('#foo').outerWidth(100).innerHeight(50);
 *      $('#bar').animate({outerWidth: 500});
 *      
 * ## Use
 * 
 * When writing reusable plugins, you often want to 
 * set or animate an element's width and height that include its padding,
 * border, or margin.  This is especially important in plugins that
 * allow custom styling.
 * 
 * The dimensions plugin overwrites [jQuery.fn.outerHeight outerHeight],
 * [jQuery.fn.outerWidth outerWidth], [jQuery.fn.innerHeight innerHeight] 
 * and [jQuery.fn.innerWidth innerWidth]
 * to let you set and animate these properties.
 * 
 * 
 * 
 * 
 * ## Demo
 * 
 * @demo jquery/dom/dimensions/dimensions.html
 */

var weird = /button|select/i, //margin is inside border
	getBoxes = {},
    checks = {
        width: ["Left", "Right"],
        height: ['Top', 'Bottom'],
        oldOuterHeight: $.fn.outerHeight,
        oldOuterWidth: $.fn.outerWidth,
        oldInnerWidth: $.fn.innerWidth,
        oldInnerHeight: $.fn.innerHeight
    };
/**
 *  @add jQuery.fn
 */
$.each({ 

/**
 * @function outerWidth
 * @parent dimensions
 * Lets you set the outer width on an object
 * @param {Number} [height] 
 * @param {Boolean} [includeMargin=false] Makes setting the outerWidth adjust 
 * for margin. Defaults to false.
 * 
 *     $('#hasMargin').outerWidth(50, true);
 * 
 * @return {jQuery|Number} If you are setting the value, returns the jQuery wrapped elements.
 */
width: 
/**
 * @function innerWidth
 * @parent dimensions
 * Lets you set the inner height of an object
 * @param {Number} [height] 
 */
"Width", 
/**
 * @function outerHeight
 * @parent dimensions
 * Lets you set the outer height of an object where: <br/> 
 * <code>outerHeight = height + padding + border + (margin)</code>.  
 * @codestart
 * $("#foo").outerHeight(100); //sets outer height
 * $("#foo").outerHeight(100, true); //uses margins
 * $("#foo").outerHeight(); //returns outer height
 * $("#foo").outerHeight(true); //returns outer height with margins
 * @codeend
 * When setting the outerHeight, it adjusts the height of the element.
 * @param {Number|Boolean} [height] If a number is provided -> sets the outer height of the object.<br/>
 * If true is given ->  returns the outer height and includes margins.<br/>
 * If no value is given -> returns the outer height without margin.
 * @param {Boolean} [includeMargin] Makes setting the outerHeight adjust for margin.
 * @return {jQuery|Number} If you are setting the value, returns the jQuery wrapped elements.
 * Otherwise, returns outerHeight in pixels.
 */
height: 
/**
 * @function innerHeight
 * @parent dimensions
 * Lets you set the outer width on an object
 * @param {Number} [height] 
 */
"Height" }, function(lower, Upper) {

    //used to get the padding and border for an element in a given direction
    getBoxes[lower] = function(el, boxes) {
        var val = 0;
        if (!weird.test(el.nodeName)) {
            //make what to check for ....
            var myChecks = [];
            $.each(checks[lower], function() {
                var direction = this;
                $.each(boxes, function(name, val) {
                    if (val)
                        myChecks.push(name + direction+ (name == 'border' ? "Width" : "") );
                })
            })
            $.each($.curStyles(el, myChecks), function(name, value) {
                val += (parseFloat(value) || 0);
            })
        }
        return val;
    }

    //getter / setter
    $.fn["outer" + Upper] = function(v, margin) {
        var first = this[0];
		if (typeof v == 'number') {
            first && this[lower](v - getBoxes[lower](first, {padding: true, border: true, margin: margin}))
            return this;
        } else {
            return first ? checks["oldOuter" + Upper].call(this, v) : null;
        }
    }
    $.fn["inner" + Upper] = function(v) {
        var first = this[0];
		if (typeof v == 'number') {
            first&& this[lower](v - getBoxes[lower](first, { padding: true }))
            return this;
        } else {
            return first ? checks["oldInner" + Upper].call(this, v) : null;
        }
    }
    //provides animations
	var animate = function(boxes){
		return function(fx){
			if (fx.state == 0) {
	            fx.start = $(fx.elem)[lower]();
	            fx.end = fx.end - getBoxes[lower](fx.elem,boxes);
	        }
	        fx.elem.style[lower] = (fx.pos * (fx.end - fx.start) + fx.start) + "px"
		}
	}
    $.fx.step["outer" + Upper] = animate({padding: true, border: true})
	
	$.fx.step["outer" + Upper+"Margin"] =  animate({padding: true, border: true, margin: true})
	
	$.fx.step["inner" + Upper] = animate({padding: true})

})

})(jQuery);

//jquery.lang.object.js

(function($){
	
var isArray = $.isArray,
	// essentially returns an object that has all the must have comparisons ...
	// must haves, do not return true when provided undefined
	cleanSet = function(obj, compares){
		var copy = $.extend({}, obj);
		for(var prop in copy) {
			var compare = compares[prop] === undefined ? compares["*"] : compares[prop];
			if( same(copy[prop], undefined, compare ) ) {
				delete copy[prop]
			}
		}
		return copy;
	},
	propCount = function(obj){
		var count = 0;
		for(var prop in obj) count++;
		return count;
	};

/**
 * @class jQuery.Object
 * @parent jquerymx.lang
 * 
 * Object contains several helper methods that 
 * help compare objects.
 * 
 * ## same
 * 
 * Returns true if two objects are similar.
 * 
 *     $.Object.same({foo: "bar"} , {bar: "foo"}) //-> false
 *   
 * ## subset
 * 
 * Returns true if an object is a set of another set.
 * 
 *     $.Object.subset({}, {foo: "bar"} ) //-> true
 * 
 * ## subsets
 * 
 * Returns the subsets of an object
 * 
 *     $.Object.subsets({userId: 20},
 *                      [
 *                       {userId: 20, limit: 30},
 *                       {userId: 5},
 *                       {}
 *                      ]) 
 *              //->    [{userId: 20, limit: 30}]
 */
$.Object = {};

/**
 * @function same
 * Returns if two objects are the same.  It takes an optional compares object that
 * can be used to make comparisons.
 * 
 * This function does not work with objects that create circular references.
 * 
 * ## Examples
 * 
 *     $.Object.same({name: "Justin"},
 *                   {name: "JUSTIN"}) //-> false
 *     
 *     // ignore the name property
 *     $.Object.same({name: "Brian"},
 *                   {name: "JUSTIN"},
 *                   {name: null})      //-> true
 *     
 *     // ignore case
 *     $.Object.same({name: "Justin"},
 *                   {name: "JUSTIN"},
 *                   {name: "i"})      //-> true
 *     
 *     // deep rule
 *     $.Object.same({ person : { name: "Justin" } },
 *                   { person : { name: "JUSTIN" } },
 *                   { person : { name: "i"      } }) //-> true
 *                   
 *     // supplied compare function
 *     $.Object.same({age: "Thirty"},
 *                   {age: 30},
 *                   {age: function( a, b ){
 *                           if( a == "Thirty" ) { 
 *                             a = 30
 *                           }
 *                           if( b == "Thirty" ) {
 *                             b = 30
 *                           }
 *                           return a === b;
 *                         }})      //-> true
 * 
 * @param {Object} a an object to compare
 * @param {Object} b an object to compare
 * @param {Object} [compares] an object that indicates how to 
 * compare specific properties. 
 * Typically this is a name / value pair
 * 
 *     $.Object.same({name: "Justin"},{name: "JUSTIN"},{name: "i"})
 *     
 * There are two compare functions that you can specify with a string:
 * 
 *   - 'i' - ignores case
 *   - null - ignores this property
 * 
 * @param {Object} [deep] used internally
 */
var same = $.Object.same = function(a, b, compares, aParent, bParent, deep){
	var aType = typeof a,
		aArray = isArray(a),
		comparesType = typeof compares,
		compare;
	
	if(comparesType == 'string' || compares === null ){
		compares = compareMethods[compares];
		comparesType = 'function'
	}
	if(comparesType == 'function'){
		return compares(a, b, aParent, bParent)
	} 
	compares = compares || {};
	
	if(deep === -1){
		return aType === 'object' || a === b;
	}
	if(aType !== typeof  b || aArray !== isArray(b)){
		return false;
	}
	if(a === b){
		return true;
	}
	if(aArray){
		if(a.length !== b.length){
			return false;
		}
		for(var i =0; i < a.length; i ++){
			compare = compares[i] === undefined ? compares["*"] : compares[i]
			if(!same(a[i],b[i], a, b, compare )){
				return false;
			}
		};
		return true;
	} else if(aType === "object" || aType === 'function'){
		var bCopy = $.extend({}, b);
		for(var prop in a){
			compare = compares[prop] === undefined ? compares["*"] : compares[prop];
			if(! same( a[prop], b[prop], compare , a, b, deep === false ? -1 : undefined )){
				return false;
			}
			delete bCopy[prop];
		}
		// go through bCopy props ... if there is no compare .. return false
		for(prop in bCopy){
			if( compares[prop] === undefined || 
			    ! same( undefined, b[prop], compares[prop] , a, b, deep === false ? -1 : undefined )){
				return false;
			}
		}
		return true;
	} 
	return false;
};

/**
 * @function subsets
 * Returns the sets in 'sets' that are a subset of checkSet
 * @param {Object} checkSet
 * @param {Object} sets
 */
$.Object.subsets = function(checkSet, sets, compares){
	var len = sets.length,
		subsets = [],
		checkPropCount = propCount(checkSet),
		setLength;
		
	for(var i =0; i < len; i++){
		//check this subset
		var set = sets[i];
		if( $.Object.subset(checkSet, set, compares) ){
			subsets.push(set)
		}
	}
	return subsets;
};
/**
 * @function subset
 * Compares if checkSet is a subset of set
 * @param {Object} checkSet
 * @param {Object} set
 * @param {Object} [compares]
 * @param {Object} [checkPropCount]
 */
$.Object.subset = function(subset, set, compares){
	// go through set {type: 'folder'} and make sure every property
	// is in subset {type: 'folder', parentId :5}
	// then make sure that set has fewer properties
	// make sure we are only checking 'important' properties
	// in subset (ones that have to have a value)
	
	var setPropCount =0,
		compares = compares || {};
			
	for(var prop in set){

		if(! same(subset[prop], set[prop], compares[prop], subset, set )  ){
			return false;
		} 
	}
	return true;
}


var compareMethods = {
	"null" : function(){
		return true;
	},
	i : function(a, b){
		return (""+a).toLowerCase() == (""+b).toLowerCase()
	}
}
	
	
})(jQuery);

//jquery.dom.fixture.js

(function( $ ) {
	
	//used to check urls
	

	
	// the pre-filter needs to re-route the url
	
	$.ajaxPrefilter( function( settings, originalOptions, jqXHR ) {
	  	// if fixtures are on
		if(! $.fixture.on) {
			return;
		}
		
		// add the fixture option if programmed in
		var data = overwrite(settings);
		
		// if we don't have a fixture, do nothing
		if(!settings.fixture){
			if(window.location.protocol === "file:"){
				;
			}
			return;
		}
		
		//if referencing something else, update the fixture option
		if ( typeof settings.fixture === "string" && $.fixture[settings.fixture] ) {
			settings.fixture = $.fixture[settings.fixture];
		}
		
		// if a string, we just point to the right url
		if ( typeof settings.fixture == "string" ) {
			var url = settings.fixture;
			
			if (/^\/\//.test(url) ) {
				url = steal.root.join(settings.fixture.substr(2));
			}
			
			settings.url = url;
			settings.data = null;
			settings.type = "GET";
			if (!settings.error ) {
				settings.error = function( xhr, error, message ) {
					throw "fixtures.js Error " + error + " " + message;
				};
			}

		}else {
			
			
			//it's a function ... add the fixture datatype so our fixture transport handles it
			// TODO: make everything go here for timing and other fun stuff
			settings.dataTypes.splice(0,0,"fixture");
			
			if(data){
				$.extend(originalOptions.data, data)
			}
			// add to settings data from fixture ...
			
		}
		
	});
		
	
	$.ajaxTransport( "fixture", function( s, original ) {

		// remove the fixture from the datatype
		s.dataTypes.shift();
		
		//we'll return the result of the next data type
		var next = s.dataTypes[0],
			timeout;
		
		return {
		
			send: function( headers , callback ) {
				
				// callback after a timeout
				timeout = setTimeout(function() {
					
					// get the callback data from the fixture function
					var response = s.fixture(original, s, headers);
					
					// normalize the fixture data into a response
					if(!$.isArray(response)){
						var tmp = [{}];
						tmp[0][next] = response
						response = tmp;
					}
					if(typeof response[0] != 'number'){
						response.unshift(200,"success")
					}
					
					// make sure we provide a response type that matches the first datatype (typically json)
					if(!response[2] || !response[2][next]){
						var tmp = {}
						tmp[next] = response[2];
						response[2] = tmp;
					}
					
					// pass the fixture data back to $.ajax
					callback.apply(null, response );
				}, $.fixture.delay);
			},
			
			abort: function() {
				clearTimeout(timeout)
			}
		};
		
	});



	var typeTest = /^(script|json|test|jsonp)$/,
		// a list of 'overwrite' settings object
		overwrites = [],
		// returns the index of an overwrite function
		find = function(settings, exact){
			for(var i =0; i < overwrites.length; i++){
				if($fixture._similar(settings, overwrites[i], exact)){
					return i;
				}
			}
			return -1;
		},
		// overwrites the settings fixture if an overwrite matches
		overwrite = function(settings){
			var index = find(settings);
			if(index > -1){
				settings.fixture = overwrites[index].fixture;
				return $fixture._getData(overwrites[index].url, settings.url)
			}

		},
		/**
		 * Makes an attempt to guess where the id is at in the url and returns it.
		 * @param {Object} settings
		 */
		getId = function(settings){
        	var id = settings.data.id;

			if(id === undefined && typeof settings.data === "number") {
				id = settings.data;
			}

			/*
			Check for id in params(if query string)
			If this is just a string representation of an id, parse
			if(id === undefined && typeof settings.data === "string") {
				id = settings.data;
			}
			//*/

			if(id === undefined){
                settings.url.replace(/\/(\d+)(\/|$|\.)/g, function(all, num){
                    id = num;
                });
            }
			
            if(id === undefined){
                id = settings.url.replace(/\/(\w+)(\/|$|\.)/g, function(all, num){
                    if(num != 'update'){
                        id = num;
                    }
                })
            }
			
			if(id === undefined){ // if still not set, guess a random number
                id = Math.round(Math.random()*1000)
            }

			return id;
		};

	/**
	 * @function jQuery.fixture
	 * @plugin jquery/dom/fixture
	 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/fixture/fixture.js
	 * @test jquery/dom/fixture/qunit.html
	 * @parent dom
	 * 
	 * <code>$.fixture</code> intercepts a AJAX request and simulates
	 * the response with a file or function. They are a great technique 
	 * when you want to develop JavaScript 
	 * independently of the backend. 
	 * 
	 * ## Types of Fixtures
	 * 
	 * There are two common ways of using fixtures.  The first is to 
	 * map Ajax requests to another file.  The following 
	 * intercepts requests to <code>/tasks.json</code> and directs them 
	 * to <code>fixtures/tasks.json</code>:
	 * 
	 *     $.fixture("/tasks.json","fixtures/tasks.json");
	 *     
	 * The other common option is to generate the Ajax response with
	 * a function.  The following intercepts updating tasks at
	 * <code>/tasks/ID.json</code> and responds with updated data:
	 * 
	 *     $.fixture("PUT /tasks/{id}.json", function(original, settings, headers){
	 *        return { updatedAt : new Date().getTime() }
	 *     })
	 * 
	 * We categorize fixtures into the following types:
	 * 
	 *   - __Static__ - the response is in a file.
	 *   - __Dynamic__ - the response is generated by a function.
	 * 
	 * There are different ways to lookup static and dynamic fixtures.
	 * 
	 * ## Static Fixtures
	 * 
	 * Static fixtures use an alternate url as the response of the Ajax request.
	 * 
	 *     // looks in fixtures/tasks1.json relative to page
	 *     $.fixture("tasks/1", "fixtures/task1.json");
	 *     
	 *     $.fixture("tasks/1", "//fixtures/task1.json");
	 * 
	 * ## Dynamic Fixtures
	 * 
	 * Dynamic Fixtures are functions that get the details of 
	 * the Ajax request and return the result of the mocked service
	 * request from your server.  
	 * 
	 * For example, the following returns a successful response 
	 * with JSON data from the server:
	 * 
	 *     $.fixture("/foobar.json", function(orig, settings, headers){
	 *       return [200, "success", {json: {foo: "bar" } }, {} ]
	 *     })
	 * 
	 * The fixture function has the following signature:
	 * 
	 *     function( originalOptions, options, headers ) {
	 *       return [ status, statusText, responses, responseHeaders ]
	 *     }
	 * 
	 * where the fixture function is called with:
	 * 
	 *   - originalOptions - are the options provided to the ajax method, unmodified,
	 *     and thus, without defaults from ajaxSettings
	 *   - options - are the request options
	 *   - headers - a map of key/value request headers
	 * 
	 * and the fixture function returns an array as arguments for  ajaxTransport's <code>completeCallback</code> with:
	 * 
	 *   - status - is the HTTP status code of the response.
	 *   - statusText - the status text of the response
	 *   - responses - a map of dataType/value that contains the responses for each data format supported
	 *   - headers - response headers
	 * 
	 * However, $.fixture handles the 
	 * common case where you want a successful response with JSON data.  The 
	 * previous can be written like:
	 * 
	 *     $.fixture("/foobar.json", function(orig, settings, headers){
	 *       return {foo: "bar" };
	 *     })
	 * 
	 * If you want to return an array of data, wrap your array in another array:
	 * 
	 *     $.fixture("/tasks.json", function(orig, settings, headers){
	 *       return [ [ "first","second","third"] ];
	 *     })
	 * 
	 * $.fixture works closesly with jQuery's 
	 * ajaxTransport system.  Understanding it is the key to creating advanced
	 * fixtures.
	 * 
	 * ### Templated Urls
	 * 
	 * Often, you want a dynamic fixture to handle urls 
	 * for multiple resources (for example a REST url scheme). $.fixture's
	 * templated urls allow you to match urls with a wildcard.  
	 * 
	 * The following example simulates services that get and update 100 todos.  
	 * 
	 *     // create todos
	 *     var todos = {};
	 *     for(var i = 0; i < 100; i++) {
	 *       todos[i] = {
	 *         id: i,
	 *         name: "Todo "+i
	 *       }
	 *     }
	 *     $.fixture("GET /todos/{id}", function(orig){
	 *       // return the JSON data
	 *       // notice that id is pulled from the url and added to data
	 *       return todos[orig.data.id]
	 *     })
	 *     $.fixture("PUT /todos/{id}", function(orig){
	 *       // update the todo's data
	 *       $.extend( todos[orig.data.id], orig.data );
	 *       
	 *       // return data
	 *       return {};
	 *     })
	 * 
	 * Notice that data found in templated urls (ex: <code>{id}</code>) is added to the original
	 * data object.
	 * 
	 * ## Simulating Errors
	 * 
	 * The following simulates an unauthorized request 
	 * to <code>/foo</code>.
	 * 
	 *     $.fixture("/foo", function(){
	 * 		return [401,"{type: 'unauthorized'}"]
	 * 	   });
	 * 
	 * This could be received by the following Ajax request:
	 * 
	 *     $.ajax({
	 *       url: '/foo',
	 *       error : function(jqXhr, status, statusText){
	 *         // status === 'error'
	 *         // statusText === "{type: 'unauthorized'}"
	 *       }
	 *     })
	 * 
	 * ## Turning off Fixtures
	 * 
	 * You can remove a fixture by passing <code>null</code> for the fixture option:
	 * 
	 *     // add a fixture
	 *     $.fixture("GET todos.json","//fixtures/todos.json");
	 *     
	 *     // remove the fixture
	 *     $.fixture("GET todos.json", null)
	 *     
	 * You can also set [jQuery.fixture.on $.fixture.on] to false:
	 * 
	 *     $.fixture.on = false;
	 * 
	 * ## Make
	 * 
	 * [jQuery.fixture.make $.fixture.make] makes a CRUD service layer that handles sorting, grouping,
	 * filtering and more.
	 * 
	 * ## Testing Performance
	 * 
	 * Dynamic fixtures are awesome for performance testing.  Want to see what 
	 * 10000 files does to your app's performance?  Make a fixture that returns 10000 items.
	 * 
	 * What to see what the app feels like when a request takes 5 seconds to return?  Set
	 * [jQuery.fixture.delay] to 5000.
	 * 
	 * @demo jquery/dom/fixture/fixture.html
	 * 
	 * @param {Object|String} settings Configures the AJAX requests the fixture should 
	 * intercept.  If an __object__ is passed, the object's properties and values
	 * are matched against the settings passed to $.ajax.  
	 * 
	 * If a __string__ is passed, it can be used to match the url and type. Urls
	 * can be templated, using <code>{NAME}</code> as wildcards.  
	 * 
	 * @param {Function|String} fixture The response to use for the AJAX 
	 * request. If a __string__ url is passed, the ajax request is redirected
	 * to the url. If a __function__ is provided, it looks like:
	 * 
	 *     fixture( originalSettings, settings, headers	)
	 *     
	 * where:
	 * 
	 *   - originalSettings - the orignal settings passed to $.ajax
	 *   - settings - the settings after all filters have run
	 *   - headers - request headers
	 *   
	 * If __null__ is passed, and there is a fixture at settings, that fixture will be removed,
	 * allowing the AJAX request to behave normally.
	 */
	var $fixture = $.fixture = function( settings , fixture ){
		// if we provide a fixture ...
		if(fixture !== undefined){
			if(typeof settings == 'string'){
				// handle url strings
				var matches = settings.match(/(GET|POST|PUT|DELETE) (.+)/i);
				if(!matches){
					settings  = {
						url : settings
					};
				} else {
					settings  = {
						url : matches[2],
						type: matches[1]
					};
				}
				
			}
			
			//handle removing.  An exact match if fixture was provided, otherwise, anything similar
			var index = find(settings, !!fixture);
			if(index > -1){
				overwrites.splice(index,1)
			}
			if(fixture == null){
				return 
			}
			settings.fixture = fixture;
			overwrites.push(settings)
		}
	};
	var replacer = $.String._regs.replacer;
	
	$.extend($.fixture, {
		// given ajax settings, find an overwrite
		_similar : function(settings, overwrite, exact){
			if(exact){
				return $.Object.same(settings , overwrite, {fixture :  null})
			} else {
				return $.Object.subset(settings, overwrite, $.fixture._compare)
			}
		},
		_compare : {
			url : function(a, b){
				return !! $fixture._getData(b, a)
			},
			fixture : null,
			type : "i"
		},
		// gets data from a url like "/todo/{id}" given "todo/5"
		_getData : function(fixtureUrl, url){
			var order = [],
				res = new RegExp(fixtureUrl.replace(replacer, function(whole, part){
			  		order.push(part)
			 		 return "([^\/])+"
				})+"$").exec(url),
				data = {};
			
			if(!res){
				return null;
			}
			res.shift();
			$.each(order, function(i, name){
				data[name] = res.shift()
			})
			return data;
		},
		/**
		 * @hide
		 * Provides a rest update fixture function
		 */
		"-restUpdate": function( settings ) {
			return [200,"succes",{
					id: getId(settings)
				},{
					location: settings.url+"/"+getId(settings)
				}];
		},
		
		/**
		 * @hide
		 * Provides a rest destroy fixture function
		 */
		"-restDestroy": function( settings, cbType ) {
			return {};
		},
		
		/**
		 * @hide
		 * Provides a rest create fixture function
		 */
		"-restCreate": function( settings, cbType, nul, id ) {
			var id = id || parseInt(Math.random() * 100000, 10);
			return [200,"succes",{
						id: id
					},{
						location: settings.url+"/"+id	
					}];
		},
		
		/**
		 * @function jQuery.fixture.make
		 * @parent jQuery.fixture
		 * Used to make fixtures for findAll / findOne style requests.
		 * 
		 *     //makes a nested list of messages
		 *     $.fixture.make(["messages","message"],1000, function(i, messages){
		 *       return {
		 *         subject: "This is message "+i,
		 *         body: "Here is some text for this message",
		 *         date: Math.floor( new Date().getTime() ),
		 *         parentId : i < 100 ? null : Math.floor(Math.random()*i)
		 *       }
		 *     })
		 *     //uses the message fixture to return messages limited by offset, limit, order, etc.
		 *     $.ajax({
		 *       url: "messages",
		 *       data:{ 
		 *          offset: 100, 
		 *          limit: 50, 
		 *          order: ["date ASC"],
		 *          parentId: 5},
		 *        },
		 *        fixture: "-messages",
		 *        success: function( messages ) {  ... }
		 *     });
		 * 
		 * @param {Array|String} types An array of the fixture names or the singular fixture name.
		 * If an array, the first item is the plural fixture name (prefixed with -) and the second
		 * item is the singular name.  If a string, it's assumed to be the singular fixture name.  Make
		 * will simply add s to the end of it for the plural name.
		 * @param {Number} count the number of items to create
		 * @param {Function} make a function that will return json data representing the object.  The
		 * make function is called back with the id and the current array of items.
		 * @param {Function} filter (optional) a function used to further filter results. Used for to simulate 
		 * server params like searchText or startDate.  The function should return true if the item passes the filter, 
		 * false otherwise.  For example:
		 * 
		 * 
		 *     function(item, settings){
		 *       if(settings.data.searchText){
		 * 	       var regex = new RegExp("^"+settings.data.searchText)
		 * 	      return regex.test(item.name);
		 *       }
		 *     }
		 * 
		 */
		make: function( types, count, make, filter ) {
			if(typeof types === "string"){
				types = [types+"s",types ]
			}
			// make all items
			var items = ($.fixture["~" + types[0]] = []), // TODO: change this to a hash
				findOne = function(id){
					for ( var i = 0; i < items.length; i++ ) {
						if ( id == items[i].id ) {
							return items[i];
						}
					}
				};
				
			for ( var i = 0; i < (count); i++ ) {
				//call back provided make
				var item = make(i, items);

				if (!item.id ) {
					item.id = i;
				}
				items.push(item);
			}
			//set plural fixture for findAll
			$.fixture["-" + types[0]] = function( settings ) {
				//copy array of items
				var retArr = items.slice(0);
				settings.data = settings.data || {};
				//sort using order
				//order looks like ["age ASC","gender DESC"]
				$.each((settings.data.order || []).slice(0).reverse(), function( i, name ) {
					var split = name.split(" ");
					retArr = retArr.sort(function( a, b ) {
						if ( split[1].toUpperCase() !== "ASC" ) {
							if( a[split[0]] < b[split[0]] ) {
								return 1;
							} else if(a[split[0]] == b[split[0]]){
								return 0
							} else {
								return -1;
							}
						}
						else {
							if( a[split[0]] < b[split[0]] ) {
								return -1;
							} else if(a[split[0]] == b[split[0]]){
								return 0
							} else {
								return 1;
							}
						}
					});
				});

				//group is just like a sort
				$.each((settings.data.group || []).slice(0).reverse(), function( i, name ) {
					var split = name.split(" ");
					retArr = retArr.sort(function( a, b ) {
						return a[split[0]] > b[split[0]];
					});
				});


				var offset = parseInt(settings.data.offset, 10) || 0,
					limit = parseInt(settings.data.limit, 10) || (items.length - offset),
					i = 0;

				//filter results if someone added an attr like parentId
				for ( var param in settings.data ) {
					i=0;
					if ( settings.data[param] !== undefined && // don't do this if the value of the param is null (ignore it)
						(param.indexOf("Id") != -1 || param.indexOf("_id") != -1) ) {
						while ( i < retArr.length ) {
							if ( settings.data[param] != retArr[i][param] ) {
								retArr.splice(i, 1);
							} else {
								i++;
							}
						}
					}
				}
				
				
				if( filter ) {
					i = 0;
					while (i < retArr.length) {
						if (!filter(retArr[i], settings)) {
							retArr.splice(i, 1);
						} else {
							i++;
						}
					}
				}

				//return data spliced with limit and offset
				return [{
					"count": retArr.length,
					"limit": settings.data.limit,
					"offset": settings.data.offset,
					"data": retArr.slice(offset, offset + limit)
				}];
			};
            // findOne
			$.fixture["-" + types[1]] = function( settings ) {
				var item = findOne(getId(settings));
				return item ? [item] : [];
			};
            // update
            $.fixture["-" + types[1]+"Update"] = function( settings, cbType ) {
                var id = getId(settings);

                // TODO: make it work with non-linear ids ..
                $.extend(findOne(id), settings.data);
				return $.fixture["-restUpdate"](settings, cbType)
			};
			$.fixture["-" + types[1]+"Destroy"] = function( settings, cbType ) {
				var id = getId(settings);
				for(var i = 0; i < items.length; i ++ ){
					if(items[i].id == id){
						items.splice(i, 1);
						break;
					}
				}
				
                // TODO: make it work with non-linear ids ..
                $.extend(findOne(id), settings.data);
				return $.fixture["-restDestroy"](settings, cbType)
			};
			$.fixture["-" + types[1]+"Create"] = function( settings, cbType ) {
                var item = make(items.length, items);
				
				$.extend(item, settings.data);
				
				if(!item.id){
					item.id = items.length;
				}
				
				items.push(item);
				
				return $.fixture["-restCreate"](settings, cbType, undefined, item.id );
			};
			
			
			return {
				getId: getId,
				findOne : findOne,
				find : function(settings){
					return findOne( getId(settings) );
				}
			}
		},
		/**
		 * @function jQuery.fixture.rand
		 * @parent jQuery.fixture
		 * 
		 * Creates random integers or random arrays of 
		 * other arrays. 
		 * 
		 * ## Examples
		 * 
		 *     var rand = $.fixture.rand;
		 *     
		 *     // get a random integer between 0 and 10 (inclusive)
		 *     rand(11);
		 *     
		 *     // get a random number between -5 and 5 (inclusive)
		 *     rand(-5, 6);
		 *     
		 *     // pick a random item from an array
		 *     rand(["j","m","v","c"],1)[0]
		 *     
		 *     // pick a random number of items from an array
		 *     rand(["j","m","v","c"])
		 *     
		 *     // pick 2 items from an array
		 *     rand(["j","m","v","c"],2)
		 *     
		 *     // pick between 2 and 3 items at random
		 *     rand(["j","m","v","c"],2,3)
		 *     
		 * 
		 * @param {Array|Number} arr An array of items to select from.
		 * If a number is provided, a random number is returned.
		 * If min and max are not provided, a random number of items are selected
		 * from this array.    
		 * @param {Number} [min] If only min is provided, min items 
		 * are selected.
		 * @param {Number} [max] If min and max are provided, a random number of
		 * items between min and max (inclusive) is selected.
		 */
		rand : function(arr, min, max){
			if(typeof arr == 'number'){
				if(typeof min  == 'number'){
					return arr+ Math.floor(Math.random() * (min - arr) );
				} else {
					return Math.floor(Math.random() * arr);
				}
				
			}
			var rand = arguments.callee;
			// get a random set
			if(min === undefined){
				return rand(arr, rand(arr.length+1))
			}
			// get a random selection of arr
			var res = [];
			arr = arr.slice(0);
			// set max
			if(!max){
				max = min;
			}
			//random max
			max = min + Math.round(  rand(max - min) )
			for(var i=0; i < max; i++){
				res.push(arr.splice( rand(arr.length), 1  )[0])
			}
			return res;
		},
		/**
		 * @hide
		 * Use $.fixture.xhr to create an object that looks like an xhr object. 
		 * 
		 * ## Example
		 * 
		 * The following example shows how the -restCreate fixture uses xhr to return 
		 * a simulated xhr object:
		 * @codestart
		 * "-restCreate" : function( settings, cbType ) {
		 *   switch(cbType){
		 *     case "success": 
		 *       return [
		 *         {id: parseInt(Math.random()*1000)}, 
		 *         "success", 
		 *         $.fixture.xhr()];
		 *     case "complete":
		 *       return [ 
		 *         $.fixture.xhr({
		 *           getResponseHeader: function() { 
		 *             return settings.url+"/"+parseInt(Math.random()*1000);
		 *           }
		 *         }),
		 *         "success"];
		 *   }
		 * }
		 * @codeend
		 * @param {Object} [xhr] properties that you want to overwrite
		 * @return {Object} an object that looks like a successful XHR object.
		 */
		xhr: function( xhr ) {
			return $.extend({}, {
				abort: $.noop,
				getAllResponseHeaders: function() {
					return "";
				},
				getResponseHeader: function() {
					return "";
				},
				open: $.noop,
				overrideMimeType: $.noop,
				readyState: 4,
				responseText: "",
				responseXML: null,
				send: $.noop,
				setRequestHeader: $.noop,
				status: 200,
				statusText: "OK"
			}, xhr);
		},
		/**
		 * @attribute on
		 * On lets you programatically turn off fixtures.  This is mostly used for testing.
		 * 
		 *     $.fixture.on = false
		 *     Task.findAll({}, function(){
		 *       $.fixture.on = true;
		 *     })
		 */
		on : true
	});
	/**
	 * @attribute $.fixture.delay
	 * @parent $.fixture
	 * Sets the delay in milliseconds between an ajax request is made and
	 * the success and complete handlers are called.  This only sets
	 * functional fixtures.  By default, the delay is 200ms.
	 * @codestart
	 * steal('jquery/dom/fixtures').then(function(){
	 *   $.fixture.delay = 1000;
	 * })
	 * @codeend
	 */
	$.fixture.delay = 200;

	$.fixture["-handleFunction"] = function( settings ) {
		if ( typeof settings.fixture === "string" && $.fixture[settings.fixture] ) {
			settings.fixture = $.fixture[settings.fixture];
		}
		if ( typeof settings.fixture == "function" ) {
			setTimeout(function() {
				if ( settings.success ) {
					settings.success.apply(null, settings.fixture(settings, "success"));
				}
				if ( settings.complete ) {
					settings.complete.apply(null, settings.fixture(settings, "complete"));
				}
			}, $.fixture.delay);
			return true;
		}
		return false;
	};

	
	
    /**
  	 * @page jquery.fixture.0organizing Organizing Fixtures
  	 * @parent jQuery.fixture
	 * 
	 * The __best__ way of organizing fixtures is to have a 'fixtures.js' file that steals
	 * <code>jquery/dom/fixture</code> and defines all your fixtures.  For example,
	 * if you have a 'todo' application, you might 
	 * have <code>todo/fixtures/fixtures.js</code> look like:
	 * 
	 *     steal({
	 *             path: '//jquery/dom/fixture.js',
	 *             ignore: true
	 *           })
	 *           .then(function(){
	 *       
	 *       $.fixture({
	 *           type: 'get',  
	 *           url: '/services/todos.json'
	 *         },
	 *         '//todo/fixtures/todos.json');
	 *         
	 *       $.fixture({
	 *           type: 'post',  
	 *           url: '/services/todos.json'
	 *         },
	 *         function(settings){
	 *         	return {id: Math.random(), 
	 *                  name: settings.data.name}
	 *         });
	 *         
	 *     })
	 * 
	 * __Notice__: We used steal's ignore option to prevent 
	 * loading the fixture plugin in production.
	 * 
	 * Finally, we steal <code>todo/fixtures/fixtures.js</code> in the 
	 * app file (<code>todo/todo.js</code>) like:
	 * 
	 * 
	 *     steal({path: '//todo/fixtures/fixtures.js',ignore: true});
	 *     
	 *     //start of your app's steals
	 *     steal( ... )
	 * 
	 * We typically keep it a one liner so it's easy to comment out.
	 * 
	 * ## Switching Between Sets of Fixtures
	 * 
	 * If you are using fixtures for testing, you often want to use different
	 * sets of fixtures.  You can add something like the following to your fixtures.js file:
	 * 
	 *     if( /fixtureSet1/.test( window.location.search) ){
	 *       $.fixture("/foo","//foo/fixtures/foo1.json');
	 *     } else if(/fixtureSet2/.test( window.location.search)){
	 *       $.fixture("/foo","//foo/fixtures/foo1.json');
	 *     } else {
	 *       // default fixtures (maybe no fixtures)
	 *     }
	 * 
	 */
})(jQuery);

//jquery.dom.form_params.js

(function( $ ) {
	var radioCheck = /radio|checkbox/i,
		keyBreaker = /[^\[\]]+/g,
		numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;

	var isNumber = function( value ) {
		if ( typeof value == 'number' ) {
			return true;
		}

		if ( typeof value != 'string' ) {
			return false;
		}

		return value.match(numberMatcher);
	};

	$.fn.extend({
		/**
		 * @parent dom
		 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/form_params/form_params.js
		 * @plugin jquery/dom/form_params
		 * @test jquery/dom/form_params/qunit.html
		 * 
		 * Returns an object of name-value pairs that represents values in a form.  
		 * It is able to nest values whose element's name has square brackets.
		 * 
		 * Example html:
		 * @codestart html
		 * &lt;form>
		 *   &lt;input name="foo[bar]" value='2'/>
		 *   &lt;input name="foo[ced]" value='4'/>
		 * &lt;form/>
		 * @codeend
		 * Example code:
		 * 
		 *     $('form').formParams() //-> { foo:{bar:'2', ced: '4'} }
		 * 
		 * 
		 * @demo jquery/dom/form_params/form_params.html
		 * 
		 * @param {Boolean} [convert=false] True if strings that look like numbers and booleans should be converted.  Defaults to true.
		 * @return {Object} An object of name-value pairs.
		 */
		formParams: function( convert ) {
			if ( this[0].nodeName.toLowerCase() == 'form' && this[0].elements ) {

				return jQuery(jQuery.makeArray(this[0].elements)).getParams(convert);
			}
			return jQuery("input[name], textarea[name], select[name]", this[0]).getParams(convert);
		},
		getParams: function( convert ) {
			var data = {},
				current;

			convert = convert === undefined ? false : convert;

			this.each(function() {
				var el = this,
					type = el.type && el.type.toLowerCase();
				//if we are submit, ignore
				if ((type == 'submit') || !el.name ) {
					return;
				}

				var key = el.name,
					value = $.data(el, "value") || $.fn.val.call([el]),
					isRadioCheck = radioCheck.test(el.type),
					parts = key.match(keyBreaker),
					write = !isRadioCheck || !! el.checked,
					//make an array of values
					lastPart;

				if ( convert ) {
					if ( isNumber(value) ) {
						value = parseFloat(value);
					} else if ( value === 'true') {
						value = true;
					} else if ( value === 'false' ) {
						value = false;
					}
					if(value === '') {
						value = undefined;
					}
				}

				// go through and create nested objects
				current = data;
				for ( var i = 0; i < parts.length - 1; i++ ) {
					if (!current[parts[i]] ) {
						current[parts[i]] = {};
					}
					current = current[parts[i]];
				}
				lastPart = parts[parts.length - 1];

				//now we are on the last part, set the value
				if ( lastPart in current && type === "checkbox" ) {
					if (!$.isArray(current[lastPart]) ) {
						current[lastPart] = current[lastPart] === undefined ? [] : [current[lastPart]];
					}
					if ( write ) {
						current[lastPart].push(value);
					}
				} else if ( write || !current[lastPart] ) {
					current[lastPart] = write ? value : undefined;
				}

			});
			return data;
		}
	});

})(jQuery);

//jquery.lang.observe.js

(function(){

var isArray =  $.isArray,
	isObject = function(obj){
		return typeof obj === 'object' && obj !== null && obj;
	},
	makeArray = $.makeArray,
	each = $.each,
	hookup = function(val, prop, parent){
		
		if(isArray(val)){
			 val = new $.Observe.List( val )
		} else {
			 val = new $.Observe( val )
		}
		
		//listen to all changes and send upwards
		val.bind("change"+parent._namespace, function(ev, attr, how, val, old ) {
			// trigger the type on this ...
			var args = $.makeArray(arguments),
				ev= args.shift();
			args[0] = prop+ (args[0] != "*" ? "."+args[0] : ""); // change the attr
			$([parent]).trigger(ev, args);
		});
		
		return val;
	},
	id = 0,
	collecting = null,
	collect = function(){
		if(!collecting){
			collecting = [];
			return true;
		}
	},
	send = function(item, event, args){
		var THIS = $([item]);
		if(!collecting){
			return THIS.trigger(event, args)
		} else {
			collecting.push({t: THIS, ev: event, args: args})
		}
	},
	sendCollection = function(){
		var len = collecting.length,
			items = collecting.slice(0),
			cur;
		collecting = null;
		for(var i =0; i < len; i++){
			cur = items[i];
			$(cur.t).trigger(cur.ev, cur.args)
		}
		
	},
	// which object to put it in
	serialize = function(observe, how, where){
		observe.each(function(name, val){
			where[name] = isObject(val) && 
				typeof val[how] == 'function' ?  val[how]() : val 
		})
		return where;
	};
	

// add - property added
// remove - property removed
// set - property value changed
/**
 * @class jQuery.Observe
 * @parent jquerymx.lang
 * @test jquery/lang/observe/qunit.html
 * 
 * Observe provides observable behavior on 
 * JavaScript Objects and Arrays. 
 * 
 * ## Use
 * 
 * Create a new Observe with the data you want to observe:
 * 
 *     var data = { 
 *       addresses : [
 *         {
 *           city: 'Chicago',
 *           state: 'IL'
 *         },
 *         {
 *           city: 'Boston',
 *           state : 'MA'
 *         }
 *         ],
 *       name : "Justin Meyer"
 *     },
 *     o = new $.Observe(data);
 *     
 * _o_ now represents an observable copy of _data_.  You
 * can read the property values of _o_ with
 * `observe.attr( name )` like:
 * 
 *     // read name
 *     o.attr('name') //-> Justin Meyer
 *     
 * And set property names of _o_ with 
 * `observe.attr( name, value )` like:
 * 
 *     // update name
 *     o.attr('name', "Brian Moschel") //-> o
 * 
 * Observe handles nested data.  Nested Objects and
 * Arrays are converted to $.Observe and 
 * $.Observe.Lists.  This lets you read nested properties 
 * and use $.Observe methods on them.  The following 
 * updates the second address (Boston) to 'New York':
 * 
 *     o.attr('addresses.1').attrs({
 *       city: 'New York',
 *       state: 'NY'
 *     })
 * 
 * When a property value is changed, it creates events
 * that you can listen to.  There are two ways to listen
 * for events:
 * 
 *   - [jQuery.Observe.prototype.bind bind] - listen for any type of change
 *   - [jQuery.Observe.prototype.delegate delegate] - listen to a specific type of change
 *     
 * With `bind( "change" , handler( ev, attr, how, newVal, oldVal ) )`, you can listen
 * to any change that happens within the 
 * observe. The handler gets called with the property name that was
 * changed, how it was changed ['add','remove','set'], the new value
 * and the old value.
 * 
 *     o.bind('change', function( ev, attr, how, nevVal, oldVal ) {
 *     
 *     })
 * 
 * `delegate( attr, event, handler(ev, newVal, oldVal ) )` lets you listen
 * to a specific even on a specific attribute. 
 * 
 *     // listen for name changes
 *     o.delegate("name","set", function(){
 *     
 *     })
 *     
 * `attrs()` can be used to get all properties back from the observe:
 * 
 *     o.attrs() // -> 
 *     { 
 *       addresses : [
 *         {
 *           city: 'Chicago',
 *           state: 'IL'
 *         },
 *         {
 *           city: 'New York',
 *           state : 'MA'
 *         }
 *       ],
 *       name : "Brian Moschel"
 *     }
 * 
 * @param {Object} obj a JavaScript Object that will be 
 * converted to an observable
 */
$.Class('jQuery.Observe',
/**
 * @prototype
 */
{
	init : function(obj){
		this._namespace = ".observe"+(++id);
		var self = this;
		for(var prop in obj){
			if(obj.hasOwnProperty(prop)){
				var val = obj[prop]
				if(isObject(val)){
					obj[prop] = hookup(val, prop, this)
				} else {
					//obj[prop] = val;
				}
			}
		}
		
		this._data = obj || {};
	},
	/**
	 * Get or set an attribute on the observe.
	 * 
	 *     o = new $.Observe({});
	 *     
	 *     // sets a user property
	 *     o.attr('user',{name: 'hank'});
	 *     
	 *     // read the user's name
	 *     o.attr('user.name') //-> 'hank'
	 * 
	 * 
	 * @param {String} attr the attribute to read
	 * @param {Object} [val] if provided, sets the value.
	 * @return {Object} the observable or the attribute property
	 */
	attr : function(attr, val){
		if(val === undefined){
			return this._get(attr)
		} else {
			
			// might set "properties.brand.0.foo".  Need to get 0 object, and trigger change
			this._set(attr, val);
			return this;
		}
	},
	each : function(){
		return each.apply(null, [this._data].concat(makeArray(arguments)) )
	},
	/**
	 * Removes a property
	 * 
	 *     o =  new $.Observe({foo: 'bar'});
	 *     o.removeAttr('foo'); //-> 'bar'
	 * 
	 * @param {String} attr
	 * @return {Object} the value being removed 
	 */
	removeAttr : function(attr){
		var parts = isArray(attr) ? attr : attr.split("."),
			prop = parts.shift()
			current = this._data[ prop ];
		
		if(parts.length){
			return current.removeAttr(parts)
		} else {
			
			delete this._data[prop];
			// add this .. 
			send(this, "change", [prop, "remove", current]);
			return current;
		}
	},
	_get : function(attr){
		var parts = isArray(attr) ? attr : attr.split("."),
			current = this._data[ parts.shift() ];
		if(parts.length){
			return current ? current._get(parts) : undefined
		} else {
			return current;
		}
	},
	_set : function(attr, value){
		var parts = isArray(attr) ? attr : (""+attr).split("."),
			prop = parts.shift() ,
			current = this._data[ prop ];
		
		// if we have an object and remaining parts, that object should get it
		if(isObject(current) && parts.length){
			current._set(parts, value)
		} else if(!parts.length){
			//we are setting
			
			// todo: check if value is object and transform
			
			
			if(value !== current){
				
				var changeType = this._data.hasOwnProperty(prop) ? "set" : "add";

				this._data[prop] = isObject(value) ? hookup(value, prop, this) : value;
				
				send(this,"change",[prop, changeType, value, current]);
				
				if(current && current.unbind){
					current.unbind("change"+this._namespace)
				}
			}
			
		} else {
			throw "jQuery.Observe: set a property on an object that does not exist"
		}		
	},
	/**
	 * Listen to changes in this observe.
	 * 
	 *     o = new $.Observe({name : "Payal"});
	 *     o.bind('change', function(ev, attr, how, newVal, oldVal){
	 *       // ev    -> {type: 'change'}
	 *       // attr  -> "name"
	 *       // how   -> "add"
	 *       // newVal-> "Justin"
	 *       // oldVal-> undefined 
	 *     })
	 *     
	 *     o.attr('name', 'Justin')
	 * 
	 * @param {String} eventType the event name.  Currently,
	 * only 'change' events are supported. For more fine 
	 * grained control, explore [jQuery.Observe.prototype.delegate].
	 * 
	 * @param {Function} handler(event, attr, how, newVal, oldVal) A 
	 * callback function where
	 * 
	 *   - event - the event
	 *   - attr - the name of the attribute changed
	 *   - how - how the attribute was changed (add, set, remove)
	 *   - newVal - the new value of the attribute
	 *   - oldVal - the old value of the attribute
	 * 
	 * @return {$.Observe} the observe
	 */
	bind : function(eventType, handler){
		$.fn.bind.apply($([this]),arguments);
		return this;
	},
	/**
	 * Unbinds a listener.
	 */
	unbind : function(eventType, handler){
		$.fn.unbind.apply($([this]),arguments);
		return this;
	},
	/**
	 * get the raw data of this observable
	 */
	serialize : function(){
		return serialize(this, 'serialize',{});
	},
	/**
	 * Set multiple properties on the observable
	 * @param {Object} props
	 * @param {Boolean} remove true if you should remove properties that are not in props
	 */
	attrs : function(props, remove){
		if(props === undefined) {
			return serialize(this,'attrs',{})
		}
		
		props = $.extend(true, {}, props);
		var prop,
			collectingStarted = collect();
			
		for(prop in this._data){
			var curVal = this._data[prop],
				newVal = props[prop];
			
			// if we are merging ...
			if(newVal === undefined){
				remove && this.removeAttr(prop);
				continue;
			}
			if(isObject(curVal) && isObject(newVal) ){
				curVal.attrs(newVal, remove)
			} else if( curVal != newVal ){
				this._set(prop, newVal)
			} else {
				
			}
			delete props[prop];
		}
		// add remaining props
		for (var prop in props) {
			newVal = props[prop];
			this._set(prop, newVal)
		}
		if(collectingStarted){
			sendCollection();
		}
	}
});
// Helpers for list

/**
 * @class jQuery.Observe.List
 * @inherits jQuery.Observe
 * @parent jQuery.Observe
 * 
 * An observable list.  You can listen to when items are push, popped,
 * spliced, shifted, and unshifted on this array.
 * 
 * 
 */
var list = jQuery.Observe('jQuery.Observe.List', 
/**
 * @prototype
 */
{
	init : function(instances){
		this.length = 0;
		this._namespace = ".list"+(++id);
        this.push.apply(this, makeArray(instances || [] ) );
		this._data = this;
	},
	serialize : function(){
		return serialize(this, 'serialize',[]);
	},
	each : function(){
		return each.apply(null, [this].concat(makeArray(arguments)) )
	},
	/**
	 * Remove items or add items from a specific point in the list.
	 * 
	 * ### Example
	 * 
	 * The following creates a list of numbers and replaces 2 and 3 with
	 * "a", and "b".
	 * 
     *     var l = new $.Observe.List([0,1,2,3]);
	 *     
	 *     l.bind('change', function( ev, attr, how, newVals, oldVals, where ) { ... })
	 *     
	 *     l.splice(1,2, "a", "b"); // results in [0,"a","b",3]
	 *     
	 * This creates 2 change events.  The first event is the removal of 
	 * numbers one and two where it's callback values will be:
	 * 
	 *   - attr - "*" - to indicate that multiple values have been changed at once
	 *   - how - "remove"
	 *   - newVals - undefined
	 *   - oldVals - [1,2] -the array of removed values
	 *   - where - 1 - the location of where these items where removed
	 * 
	 * The second change event is the addition of the "a", and "b" values where 
	 * the callback values will be:
	 * 
	 *   - attr - "*" - to indicate that multiple values have been changed at once
	 *   - how - "added"
	 *   - newVals - ["a","b"]
	 *   - oldVals - [1, 2] - the array of removed values
	 *   - where - 1 - the location of where these items where added
	 * 
	 * @param {Number} index where to start removing or adding items
	 * @param {Object} count the number of items to remove
	 * @param {Object} [added] an object to add to 
	 */
	splice : function(index, count){
		var args = makeArray(arguments);

		for(var i=0; i < args.length; i++){
			var val = args[i];
			if(isObject(val)){
				args[i] = hookup(val, index+i, this)
			} 
		}
		if(count === undefined){
			count = args[1] = this.length - index;
		}
		var removed = [].splice.apply(this, args);
		if(count > 0){
			send(this, "change",["*","remove",undefined, removed, index]);
		}
		if(args.length > 2){
			send(this, "change",["*","add",args.slice(2), removed, index]);
		}
		return removed;
	},
	/**
	 * Updates an array with a new array.  It is able to handle
	 * removes in the middle of the array.
	 * @param {Object} props
	 * @param {Object} remove
	 */
	attrs : function(props, remove){
		if( props === undefined ){
			return serialize(this, 'attrs',[]);
		}
		
		// copy
		props = props.slice(0);
		
		var len = Math.min(props.length, this.length),
			collectingStarted = collect();
		for(var prop =0; prop < len; prop++) {
			var curVal =  this[prop],
				newVal = props[prop];
			
			if(isObject(curVal) && isObject(newVal) ){
				curVal.attrs(newVal, remove)
			} else if( curVal != newVal ){
				this._set(prop, newVal)
			} else {
				
			}
		}
		if(props.length > this.length){
			// add in the remaining props
			this.push(props.slice(this.length))
		} else if(props.length < this.length && remove){
			this.splice(props.length)
		}
		//remove those props didn't get too
		if(collectingStarted){
			sendCollection()
		}
	}
}),


// create push and pop:
	getArgs = function(args){
		if(args[0] && ( $.isArray(args[0])  )   ){
			return args[0]
		}
		else{
			return makeArray(args)
		}
	},
	push = [].push,
	pop = [].pop;
	
	$.each({
		/**
		 * @function push
		 * Add items to the end of the list.
		 * 
		 *     var l = new $.Observe.List([]);
		 *     
		 *     l.bind('change', function( 
		 *         ev,        // the change event
		 *         attr,      // the attr that was changed, for multiple items, "*" is used 
		 *         how,       // "add"
		 *         newVals,   // an array of new values pushed
		 *         oldVals,   // undefined
		 *         where      // the location where these items where added
		 *         ) {
		 *     
		 *     })
		 *     
		 *     l.push('0','1','2');
		 * 
		 * @return {Number} the number of items in the array
		 */
		push : "length",
		/**
		 * @function unshift
		 * Add items to the start of the list.  This is very similar to
		 * [jQuery.Observe.prototype.push].
		 */
	 	unshift : 0
	}, 
	function(name, where){
	 	list.prototype[name] = function(){
			var args = getArgs(arguments),
				self = this,
				len = where ? this.length : 0;
			
			for(var i=0; i < args.length; i++){
				var val = args[i];
				if(isObject(val)){
					args[i] = hookup(val, i, this)
				} 
			}
			var res = [][name].apply( this, args )
			//do this first so we could prevent?
	
			send(this, "change", ["*","add",args, undefined, len] )
			
			return res;
		}
	 });
	
$.each({
		/**
		 * @function pop
		 * 
		 * Removes an item from the end of the list.
		 * 
		 *     var l = new $.Observe.List([0,1,2]);
		 *     
		 *     l.bind('change', function( 
		 *         ev,        // the change event
		 *         attr,      // the attr that was changed, for multiple items, "*" is used 
		 *         how,       // "remove"
		 *         newVals,   // undefined
		 *         oldVals,   // 2
		 *         where      // the location where these items where added
		 *         ) {
		 *     
		 *     })
		 *     
		 *     l.pop();
		 * 
		 * @return {Object} the element at the end of the list
		 */
		pop : "length",
		/**
		 * @function shift
		 * Removes an item from the start of the list.  This is very similar to
		 * [jQuery.Observe.prototype.pop].
		 * 
		 * @return {Object} the element at the start of the list
		 */
	 	shift : 0
	}, 
	function(name, where){
	 	list.prototype[name] = function(){
			var args = getArgs(arguments),
				self = this,
				len = where && this.length ? this.length - 1 : 0;
			
			var res = [][name].apply( this, args )
			//do this first so we could prevent?
	
			send(this, "change", ["*","remove", undefined, [res], len] )
			
			return res;
		}
	 });

})(jQuery);

//jquery.lang.string.deparam.js

(function($){
	
	var digitTest = /^\d+$/,
		keyBreaker = /([^\[\]]+)|(\[\])/g,
		plus = /\+/g,
		paramTest = /([^?#]*)(#.*)?$/;
	
	/**
	 * @add jQuery.String
	 */
	$.String = $.extend($.String || {}, { 
		
		/**
		 * @function deparam
		 * 
		 * Takes a string of name value pairs and returns a Object literal that represents those params.
		 * 
		 * @param {String} params a string like <code>"foo=bar&person[age]=3"</code>
		 * @return {Object} A JavaScript Object that represents the params:
		 * 
		 *     {
		 *       foo: "bar",
		 *       person: {
		 *         age: "3"
		 *       }
		 *     }
		 */
		deparam: function(params){
		
			if(! params || ! paramTest.test(params) ) {
				return {};
			} 
		   
		
			var data = {},
				pairs = params.split('&'),
				current;
				
			for(var i=0; i < pairs.length; i++){
				current = data;
				var pair = pairs[i].split('=');
				
				// if we find foo=1+1=2
				if(pair.length != 2) { 
					pair = [pair[0], pair.slice(1).join("=")]
				}
				  
        var key = decodeURIComponent(pair[0].replace(plus, " ")), 
          value = decodeURIComponent(pair[1].replace(plus, " ")),
					parts = key.match(keyBreaker);
		
				for ( var j = 0; j < parts.length - 1; j++ ) {
					var part = parts[j];
					if (!current[part] ) {
						// if what we are pointing to looks like an array
						current[part] = digitTest.test(parts[j+1]) || parts[j+1] == "[]" ? [] : {}
					}
					current = current[part];
				}
				lastPart = parts[parts.length - 1];
				if(lastPart == "[]"){
					current.push(value)
				}else{
					current[lastPart] = value;
				}
			}
			return data;
		}
	});
	
})(jQuery);

//jquery.lang.observe.delegate.js

(function(){
	
	/**
	 * @add jQuery.Observe.prototype
	 */
	
	// tells if the parts part of a delegate matches the broken up props of the event
	var matches = function(delegate, props){
		//check props parts are the same or 
		var parts = delegate.parts,
			len = parts.length,
			i =0;
		
		// if the event matches
		for(i; i< len; i++){
			if(parts[i] == "**") {
				return true;
			} else if( typeof props[i] == 'string' && ( props[i] === parts[i] || parts[i] === "*" ) ) {
				
			} else {
				return false;
			}
		}
		return len === props.length;
	},
		delegate = function(event, prop, how, newVal, oldVal){
			var props = prop.split("."),
				delegates = $.data(this,"_observe_delegates") || [],
				delegate;
			event.attr = prop;
			event.lastAttr = props[props.length -1 ];
			
			for(var i =0; i < delegates.length; i++){
				// check delegate.event
				delegate = delegates[i];
				
				if(  delegate.event === 'change' && matches(delegate, props) ){
					delegate.callback.apply(this.attr(prop), arguments);
				} else if(delegate.event === how && matches(delegate, props) ){
					delegate.callback.apply(this.attr(prop), [event,newVal, oldVal]);
				} else if(delegate.event === 'set' && how == 'add' && matches(delegates[i], props)) {
					delegate.callback.apply(this.attr(prop), [event,newVal, oldVal]);
				}
			}
		};
		
	$.extend($.Observe.prototype,{
		/**
		 * @plugin jquery/lang/observe/delegate
		 * Listen for changes in a child attribute from the parent. The child attribute
		 * does not have to exist.
		 * 
		 *     
		 *     // create an observable
		 *     var observe = new $.Observe({
		 *       foo : {
		 *         bar : "Hello World"
		 *       }
		 *     })
		 *     
		 *     //listen to changes on a property
		 *     observe.delegate("foo.bar","change", function(ev, prop, how, newVal, oldVal){
		 *       // foo.bar has been added, set, or removed
		 *     });
		 * 
		 *     // change the property
		 *     observe.attr('foo.bar',"Goodbye Cruel World")
		 * 
		 * ## Types of events
		 * 
		 * Delegate lets you listen to add, set, remove, and change events on property.
		 * 
		 * __add__
		 * 
		 * An add event is fired when a new property has been added.
		 * 
		 *     var o = new $.Observe({});
		 *     o.delegate("name","add", function(ev, value){
		 *       // called once
		 *       $('#name').show()
		 *     })
		 *     o.attr('name',"Justin")
		 *     o.attr('name',"Brian");
		 *     
		 * Listening to add events is useful for 'setup' functionality (in this case
		 * showing the <code>#name</code> element.
		 * 
		 * __set__
		 * 
		 * Set events are fired when a property takes on a new value.  set events are
		 * always fired after an add.
		 * 
		 *     o.delegate("name","set", function(ev, value){
		 *       // called twice
		 *       $('#name').text(value)
		 *     })
		 *     o.attr('name',"Justin")
		 *     o.attr('name',"Brian");
		 * 
		 * __remove__
		 * 
		 * Remove events are fired after a property is removed.
		 * 
		 *     o.delegate("name","remove", function(ev){
		 *       // called once
		 *       $('#name').text(value)
		 *     })
		 *     o.attr('name',"Justin");
		 *     o.removeAttr('name');
		 * 
		 * ## Wildcards - matching multiple properties
		 * 
		 * Sometimes, you want to know when any property within some part 
		 * of an observe has changed. Delegate lets you use wildcards to 
		 * match any property name.  The following listens for any change
		 * on an attribute of the params attribute:
		 * 
		 *     var o = $.Observe({
		 *       options : {
		 *         limit : 100,
		 *         offset: 0,
		 *         params : {
		 *           parentId: 5
		 *         }
		 *       }
		 *     })
		 *     o.delegate('options.*','change', function(){
		 *       alert('1');
		 *     })
		 *     o.delegate('options.**','change', function(){
		 *       alert('2');
		 *     })
		 *     
		 *     // alerts 1
		 *     // alerts 2
		 *     o.attr('options.offset',100)
		 *     
		 *     // alerts 2
		 *     o.attr('options.params.parentId',6);
		 * 
		 * Using a single wildcard (<code>*</code>) matches single level
		 * properties.  Using a double wildcard (<code>**</code>) matches
		 * any deep property.
		 * 
		 * @param {String} attr the attribute you want to listen for changes in.
		 * @param {String} event the event name
		 * @param {Function} cb the callback handler
		 * @return {jQuery.Delegate} the delegate for chaining
		 */
		delegate :  function(attr, event, cb){
			attr = $.trim(attr);
			var delegates = $.data(this, "_observe_delegates") ||
				$.data(this, "_observe_delegates", []);
			attr = $.trim(attr);
			delegates.push({
				attr : attr,
				parts : attr.split('.'),
				callback : cb,
				event: event
			});
			if(delegates.length === 1){
				this.bind("change",delegate)
			}
			return this;
		},
		/**
		 * @plugin jquery/lang/observe/delegate
		 * Removes a delegate event handler.
		 * 
		 *   observe.undelegate("name","set", function(){ ... })
		 * 
		 * @param {String} attr the attribute name of the object you want to undelegate from.
		 * @param {String} event the event name
		 * @param {Function} cb the callback handler
		 * @return {jQuery.Delegate} the delegate for chaining
		 */
		undelegate : function(attr, event, cb){
			attr = $.trim(attr);
			
			var i =0,
				delegates = $.data(this, "_observe_delegates") || [],
				delegate;
			if(attr){
				while(i < delegates.length){
					delegate = delegates[i];
					if( delegate.callback === cb ||
						(!cb && delegate.attr === attr) ){
						delegates.splice(i,1)
					} else {
						i++;
					}
				}
			} else {
				delegates = [];
			}
			if(!delegates.length){
				$.removeData(this, "_observe_delegates");
				this.unbind("change",delegate)
			}
			return this;
		}
	})
})(jQuery);

//jquery.dom.route.js

(function( $ ) {

    // Helper methods used for matching routes.
	var 
		// RegEx used to match route variables of the type ':name'.
        // Any word character or a period is matched.
        matcher = /\:([\w\.]+)/g,
        // Regular expression for identifying &amp;key=value lists.
        paramsMatcher = /^(?:&[^=]+=[^&]*)+/,
        // Converts a JS Object into a list of parameters that can be 
        // inserted into an html element tag.
		makeProps = function( props ) {
			var html = [],
				name, val;
			for ( name in props ) {
				val = props[name]
				if ( name === 'className' ) {
					name = 'class'
				}
				val && html.push(escapeHTML(name), "=\"", escapeHTML(val), "\" ");
			}
			return html.join("")
		},
        // Escapes ' and " for safe insertion into html tag parameters.
		escapeHTML = function( content ) {
			return content.replace(/"/g, '&#34;').replace(/'/g, "&#39;");
		},
		// Checks if a route matches the data provided. If any route variable
        // is not present in the data the route does not match. If all route
        // variables are present in the data the number of matches is returned 
        // to allow discerning between general and more specific routes. 
		matchesData = function(route, data) {
			var count = 0;
			for ( var i = 0; i < route.names.length; i++ ) {
				if (!data.hasOwnProperty(route.names[i]) ) {
					return -1;
				}
				count++;
			}
			return count;
		},
        // 
		onready = true,
		location = window.location;

	/**
	 * @class jQuery.route
	 * @inherits jQuery.Observe
	 * @plugin jquery/dom/route
	 * @parent dom
	 * @tag 3.2
	 * 
	 * jQuery.route helps manage browser history (and
	 * client state) by
	 * synchronizing the window.location.hash with
	 * an [jQuery.Observe].
	 * 
	 * ## Background Information
	 * 
	 * To support the browser's back button and bookmarking
	 * in an Ajax application, most applications use
	 * the <code>window.location.hash</code>.  By
	 * changing the hash (via a link or JavaScript), 
	 * one is able to add to the browser's history 
	 * without changing the page.  The [jQuery.event.special.hashchange event] allows
	 * you to listen to when the hash is changed.
	 * 
	 * Combined, this provides the basics needed to
	 * create history enabled Ajax websites.  However,
	 * jQuery.Route addresses several other needs such as:
	 * 
	 *   - Pretty Routes
	 *   - Keeping routes independent of application code
	 *   - Listening to specific parts of the history changing
	 *   - Setup / Teardown of widgets.
	 * 
	 * ## How it works
	 * 
	 * <code>$.route</code> is a [jQuery.Observe $.Observe] that represents the
	 * <code>window.location.hash</code> as an 
	 * object.  For example, if the hash looks like:
	 * 
	 *     #!type=videos&id=5
	 *     
	 * the data in <code>$.route</code> would look like:
	 * 
	 *     { type: 'videos', id: 5 }
	 * 
	 * 
	 * $.route keeps the state of the hash in-sync with the data in
	 * $.route.
	 * 
	 * ## $.Observe
	 * 
	 * $.route is a [jQuery.Observe $.Observe]. Understanding
	 * $.Observe is essential for using $.route correctly.
	 * 
	 * You can
	 * listen to changes in an Observe with bind and
	 * delegate and change $.route's properties with 
	 * attr and attrs.
	 * 
	 * ### Listening to changes in an Observable
	 * 
	 * Listen to changes in history 
	 * by [jQuery.Observe.prototype.bind bind]ing to
	 * changes in <code>$.route</code> like:
	 * 
	 *     $.route.bind('change', function(ev, attr, how, newVal, oldVal) {
	 *     
	 *     })
	 * 
     *  - attr - the name of the changed attribute
     *  - how - the type of Observe change event (add, set or remove)
     *  - newVal/oldVal - the new and old values of the attribute
     * 
	 * You can also listen to specific changes 
	 * with [jQuery.Observe.prototype.delegate delegate]:
	 * 
	 *     $.route.delegate('id','change', function(){ ... })
	 * 
	 * Observe lets you listen to the following events:
	 * 
	 *  - change - any change to the object
	 *  - add - a property is added
	 *  - set - a property value is added or changed
	 *  - remove - a property is removed
	 * 
	 * Listening for <code>add</code> is useful for widget setup
	 * behavior, <code>remove</code> is useful for teardown.
	 * 
	 * ### Updating an observable
	 * 
	 * Create changes in the route data like:
	 * 
	 *     $.route.attr('type','images');
	 * 
	 * Or change multiple properties at once with
	 * [jQuery.Observe.prototype.attrs attrs]:
	 * 
	 *     $.route.attrs({type: 'pages', id: 5}, true)
	 * 
	 * When you make changes to $.route, they will automatically
	 * change the <code>hash</code>.
	 * 
	 * ## Creating a Route
	 * 
	 * Use <code>$.route(url, defaults)</code> to create a 
	 * route. A route is a mapping from a url to 
	 * an object (that is the $.route's state).
	 * 
	 * If no routes are added, or no route is matched, 
	 * $.route's data is updated with the [jQuery.String.deparam deparamed]
	 * hash.
	 * 
	 *     location.hash = "#!type=videos";
	 *     // $.route -> {type : "videos"}
	 *     
	 * Once routes are added and the hash changes,
	 * $.route looks for matching routes and uses them
	 * to update $.route's data.
	 * 
	 *     $.route( "content/:type" );
	 *     location.hash = "#!content/images";
	 *     // $.route -> {type : "images"}
	 *     
	 * Default values can also be added:
	 * 
	 *     $.route("content/:type",{type: "videos" });
	 *     location.hash = "#!content/"
	 *     // $.route -> {type : "videos"}
	 *     
	 * ## Delay setting $.route
	 * 
	 * By default, <code>$.route</code> sets its initial data
	 * on document ready.  Sometimes, you want to wait to set 
	 * this data.  To wait, call:
	 * 
	 *     $.route.ready(false);
	 * 
	 * and when ready, call:
	 * 
	 *     $.route.ready(true);
	 * 
	 * ## Changing the route.
	 * 
	 * Typically, you never want to set <code>location.hash</code>
	 * directly.  Instead, you can change properties on <code>$.route</code>
	 * like:
	 * 
	 *     $.route.attr('type', 'videos')
	 *     
	 * This will automatically look up the appropriate 
	 * route and update the hash.
	 * 
	 * Often, you want to create links.  <code>$.route</code> provides
	 * the [jQuery.route.link] and [jQuery.route.url] helpers to make this 
	 * easy:
	 * 
	 *     $.route.link("Videos", {type: 'videos'})
	 * 
	 * @param {String} url the fragment identifier to match.  
	 * @param {Object} [defaults] an object of default values
	 * @return {jQuery.route}
	 */
	var $route = $.route = function( url, defaults ) {
        // Extract the variable names and replace with regEx that will match an atual URL with values.
		var names = [],
			test = url.replace(matcher, function( whole, name ) {
				names.push(name)
				return "([\\w\\.]*)"  // The '\\' is for string-escaping giving single '\' for regEx escaping
			});

		// Add route in a form that can be easily figured out
		$route.routes[url] = {
            // A regular expression that will match the route when variable values 
            // are present; i.e. for :page/:type the regEx is /([\w\.]*)/([\w\.]*)/ which
            // will match for any value of :page and :type (word chars or period).
			test: new RegExp("^" + test),
            // The original URL, same as the index for this entry in routes.
			route: url,
            // An array of all the variable names in this route
			names: names,
            // Default values provided for the variables.
			defaults: defaults || {},
            // The number of parts in the URL separated by '/'.
			length: url.split('/').length
		}
		return $route;
	};

	$.extend($route, {
		/**
		 * Parameterizes the raw JS object representation provided in data.
		 * If a route matching the provided data is found that URL is built
         * from the data. Any remaining data is added at the end of the
         * URL as &amp; separated key/value parameters.
		 * 
		 * @param {Object} data
         * @return {String} The route URL and &amp; separated parameters.
		 */
		param: function( data ) {
			// Check if the provided data keys match the names in any routes;
			// get the one with the most matches.
			var route,
				matches = -1,
				temp,
				matchCount;
			for ( var name in $route.routes ) {
                temp = $route.routes[name],
                matchCount = matchesData(temp, data);
				if ( matchCount > matches ) {
					route = temp;
					matches = matchCount
				}
			}
			if ( route ) {
				var cpy = $.extend({}, data),
                    // Create the url by replacing the var names with the provided data.
                    // If the default value is found an empty string is inserted.
				    res = route.route.replace(matcher, function( whole, name ) {
                        delete cpy[name];
                        return data[name] === route.defaults[name] ? "" : data[name];
                    }),
                    after;
					
					// remove matching default values
					for(name in route.defaults) {
						if(cpy[name] === route.defaults[name]) {
							delete cpy[name]
						}
					}
					
					// The remaining elements of data are added as 
					// $amp; separated parameters to the url.
				    after = $.param(cpy);
				return res + (after ? "&" + after : "")
			}
            // If no route was found there is no hash URL, only paramters.
			return $.isEmptyObject(data) ? "" : "&" + $.param(data);
		},
		/**
		 * Populate the JS data object from a given URL.
		 * 
		 * @param {Object} url
		 */
		deparam: function( url ) {
			// See if the url matches any routes by testing it against the route.test regEx.
            // By comparing the URL length the most specialized route that matches is used.
			var route = {
				length: -1
			};
			for ( var name in $route.routes ) {
				var temp = $route.routes[name]
				if ( temp.test.test(url) && temp.length > route.length ) {
					route = temp;
				}
			}
            // If a route was matched
			if ( route.length > -1 ) { 
				var // Since RegEx backreferences are used in route.test (round brackets)
                    // the parts will contain the full matched string and each variable (backreferenced) value.
                    parts = url.match(route.test),
                    // start will contain the full mathced string; parts contain the variable values.
					start = parts.shift(),
                    // The remainder will be the &amp;key=value list at the end of the URL.
					remainder = url.substr(start.length),
                    // If there is a remainder and it contains a &amp;key=value list deparam it.
                    obj = (remainder && paramsMatcher.test(remainder)) ? $.String.deparam( remainder.slice(1) ) : {};

                // Add the default values for this route
				obj = $.extend(true, {}, route.defaults, obj);
                // Overwrite each of the default values in obj with those in parts if that part is not empty.
				for ( var p = 0; p < parts.length; p++ ) {
					if ( parts[p] ) {
						obj[route.names[p]] = parts[p]
					}
				}
				return obj;
			}
            // If no route was matched it is parsed as a &amp;key=value list.
			return paramsMatcher.test(url) ? $.String.deparam( url.slice(1) ) : {};
		},
		/**
		 * @hide
		 * A $.Observe that represents the state of the history.
		 */
		data: new $.Observe({}),
        /**
         * @attribute
         * @type Object
		 * @hide
		 * 
         * A list of routes recognized by the router indixed by the url used to add it.
         * Each route is an object with these members:
         * 
 		 *  - test - A regular expression that will match the route when variable values 
         *    are present; i.e. for :page/:type the regEx is /([\w\.]*)/([\w\.]*)/ which
         *    will match for any value of :page and :type (word chars or period).
		 * 
         *  - route - The original URL, same as the index for this entry in routes.
         * 
		 *  - names - An array of all the variable names in this route
         * 
		 *  - defaults - Default values provided for the variables or an empty object.
         * 
		 *  - length - The number of parts in the URL separated by '/'.
         */
		routes: {},
		/**
		 * Indicates that all routes have been added and sets $.route.data
		 * based upon the routes and the current hash.
		 * @param {Boolean} [start]
		 * @return 
		 */
		ready: function(val) {
			if( val === false ) {
				onready = false;
			}
			if( val === true || onready === true ) {
				setState();
			}
			return $route;
		},
		/**
		 * Returns a url from the options
		 * @param {Object} options
		 * @param {Boolean} merge true if the options should be merged with the current options
		 * @return {String} 
		 */
		url: function( options, merge ) {
			if (merge) {
				return "#!" + $route.param($.extend({}, curParams, options))
			} else {
				return "#!" + $route.param(options)
			}
		},
		/**
		 * Returns a link
		 * @param {Object} name The text of the link.
		 * @param {Object} options The route options (variables)
		 * @param {Object} props Properties of the &lt;a&gt; other than href.
         * @param {Boolean} merge true if the options should be merged with the current options
		 */
		link: function( name, options, props, merge ) {
			return "<a " + makeProps(
			$.extend({
				href: $route.url(options, merge)
			}, props)) + ">" + name + "</a>";
		},
		/**
		 * Returns if the options represent the current page.
		 * @param {Object} options
		 */
		current: function( options ) {
			return location.hash == "#!" + $route.param(options)
		},
        /**
         * Change the current page using either a data object or a url string.
         * @param {Object|String} loc The object with attributes or hash string.
         * @param {Boolean} remove true to remove properties not in loc, only if loc === Object, default true.
         * @return $.route Fluent interface.
         */
        set: function(loc, remove) {
            if ($.isPlainObject( loc )) {
                $route.attrs( loc, (typeof remove == "undefined") ? true : remove );
            } else if (typeof loc == "string") {
                var pre = "";
                if (loc[0] != '!' && loc[1] != '!') {
                    pre = '#!';
                }
                location.hash = pre + loc;
            }
            return $route;
        }
	});
	// onready
	$(function() {
		$.route.ready();
	});
	
    // The functions in the following list applied to $.route (e.g. $.route.attr('...')) will
    // instead act on the $.route.data Observe.
	$.each(['bind','unbind','delegate','undelegate','attr','attrs','serialize','removeAttr'], function(i, name){
		$route[name] = function(){
			return $route.data[name].apply($route.data, arguments)
		}
	})

	var // A throttled function called multiple times will only fire once the
        // timer runs down. Each call resets the timer.
        throttle = function( func, time ) {
            var timer;
            return function() {
                clearTimeout(timer);
                timer = setTimeout(func, time || 1);
            }
        },
        // Intermediate storage for $.route.data.
        curParams,
        // Deparameterizes the portion of the hash of interest and assign the
        // values to the $.route.data removing existing values no longer in the hash.
        setState = function() {
			// commented out code handles people setting attrs before onready
			//if( $.isEmptyObject( $route.data.serialize() ) ) {
				var hash = location.hash.substr(1, 1) === '!' ? 
					location.hash.slice(2) : 
					location.hash.slice(1); // everything after #!
				curParams = $route.deparam( hash );
				$route.attrs(curParams, true);
			//} else {
			//	window.location.hash = "#!" + $route.param($route.data.serialize())
			//}
			
		};

	// If the hash changes, update the $.route.data
	$(window).bind('hashchange', setState);

	// If the $.route.data changes, update the hash.
    // Using .serialize() retrieves the raw data contained in the observable.
    // This function is throttled so it only updates once even if multiple values changed.
	$route.data.bind("change", throttle(function() {
		location.hash = "#!" + $route.param($route.data.serialize())
	}));
})(jQuery);

//jquery.dom.range.js

(function($){
// TODOS ...
// Ad

/**
 * @function jQuery.fn.range
 * @parent $.Range
 * 
 * Returns a jQuery.Range for the element selected.
 * 
 *     $('#content').range()
 */
$.fn.range = function(){
	return $.Range(this[0])
}

var convertType = function(type){
	return  type.replace(/([a-z])([a-z]+)/gi, function(all,first,  next){
			  return first+next.toLowerCase()	
			}).replace(/_/g,"");
},
reverse = function(type){
	return type.replace(/^([a-z]+)_TO_([a-z]+)/i, function(all, first, last){
		return last+"_TO_"+first;
	});
},
getWindow = function( element ) {
	return element ? element.ownerDocument.defaultView || element.ownerDocument.parentWindow : window
},
bisect = function(el, start, end){
	//split the start and end ... figure out who is touching ...
	if(end-start == 1){
		return 
	}
},
support = {};
/**
 * @Class jQuery.Range
 * @parent dom
 * @tag alpha
 * 
 * Provides text range helpers for creating, moving, 
 * and comparing ranges cross browser.
 * 
 * ## Examples
 * 
 *     // Get the current range
 *     var range = $.Range.current()
 *     
 *     // move the end of the range 2 characters right
 *     range.end("+2")
 *     
 *     // get the startOffset of the range and the container
 *     range.start() //-> { offset: 2, container: HTMLELement }
 *     
 *     //get the most common ancestor element
 *     var parent = range.parent()
 *     
 *     //select the parent
 *     var range2 = new $.Range(parent)
 * 
 * @constructor
 * 
 * Returns a jQuery range object.
 * 
 * @param {TextRange|HTMLElement|Point} [range] An object specifiying a 
 * range.  Depending on the object, the selected text will be different.  $.Range supports the
 * following types 
 * 
 *   - __undefined or null__ - returns a range with nothing selected
 *   - __HTMLElement__ - returns a range with the node's text selected
 *   - __Point__ - returns a range at the point on the screen.  The point can be specified like:
 *         
 *         //client coordinates
 *         {clientX: 200, clientY: 300}
 *         
 *         //page coordinates
 *         {pageX: 200, pageY: 300} 
 *         {top: 200, left: 300}
 *         
 *   - __TextRange__ a raw text range object.
 */
$.Range = function(range){
	if(this.constructor !== $.Range){
		return new $.Range(range);
	}
	if(range && range.jquery){
		range = range[0];
	}
	// create one
	if(!range || range.nodeType){
		this.win = getWindow(range)
		if(this.win.document.createRange){
			this.range = this.win.document.createRange()
		}else{
			this.range = this.win.document.body.createTextRange()
		}
		if(range){
			this.select(range)
		}
		
	} else if (range.clientX != null || range.pageX != null || range.left != null) {
		this.moveToPoint(range)
	} else if (range.originalEvent && range.originalEvent.touches && range.originalEvent.touches.length) {
		this.moveToPoint(range.originalEvent.touches[0])
	} else if (range.originalEvent && range.originalEvent.changedTouches && range.originalEvent.changedTouches.length) {
		this.moveToPoint(range.originalEvent.changedTouches[0])
	} else {
		this.range = range;
	} 
};
/**
 * @static
 */
$.Range.
/**
 * Gets the current range.
 * 
 *     $.Range.current() //-> jquery.range
 * 
 * @param {HTMLElement} [el] an optional element used to get selection for a given window.
 * @return {jQuery.Range} a jQuery.Range wrapped range.
 */
current = function(el){
	var win = getWindow(el),
		selection;
	if(win.getSelection){
		selection = win.getSelection()
		return new $.Range( selection.rangeCount ? selection.getRangeAt(0) : win.document.createRange())
	}else{
		return  new $.Range( win.document.selection.createRange() );
	}
};




$.extend($.Range.prototype,
/** @prototype **/
{
	moveToPoint : function(point){
		var clientX = point.clientX, clientY = point.clientY
		if(!clientX){
			var off = scrollOffset();
			clientX = (point.pageX || point.left || 0 ) - off.left;
			clientY = (point.pageY || point.top || 0 ) - off.top;
		}
		if(support.moveToPoint){
			this.range = $.Range().range
			this.range.moveToPoint(clientX, clientY);
			return this;
		}
		
		
		// it's some text node in this range ...
		var parent = document.elementFromPoint(clientX, clientY);
		
		//typically it will be 'on' text
		for(var n=0; n < parent.childNodes.length; n++){
			var node = parent.childNodes[n];
			if(node.nodeType === 3 || node.nodeType === 4){
				var range = $.Range(node),
					length = range.toString().length;
				
				
				// now lets start moving the end until the boundingRect is within our range
				
				for(var i = 1; i < length+1; i++){
					var rect = range.end(i).rect();
					if(rect.left <= clientX && rect.left+rect.width >= clientX &&
					  rect.top <= clientY && rect.top+rect.height >= clientY ){
						range.start(i-1); 
						this.range = range.range;
						return; 	
					}
				}
			}
		}
		
		// if not 'on' text, recursively go through and find out when we shift to next
		// 'line'
		var previous;
		iterate(parent.childNodes, function(textNode){
			var range = $.Range(textNode);
			if(range.rect().top > point.clientY){
				return false;
			}else{
				previous = range;
			}
		});
		if(previous){
			previous.start(previous.toString().length);
			this.range = previous.range;
		}else{
			this.range = $.Range(parent).range
		}
		
	},
	
	window : function(){
		return this.win || window;
	},
	/**
	 * Return true if any portion of these two ranges overlap.
	 * 
	 *     var foo = document.getElementById('foo');
	 *     
	 *     $.Range(foo.childNodes[0]).compare(foo.childNodes[1]) //-> false
	 * 
	 * @param {jQuery.Range} elRange
	 * @return {Boolean} true if part of the ranges overlap, false if otherwise.
	 */
	overlaps : function(elRange){
		if(elRange.nodeType){
			elRange = $.Range(elRange).select(elRange);
		}
		//if the start is within the element ...
		var startToStart = this.compare("START_TO_START", elRange),
			endToEnd = this.compare("END_TO_END", elRange)
		
		// if we wrap elRange
		if(startToStart <=0 && endToEnd >=0){
			return true;
		}
		// if our start is inside of it
		if( startToStart >= 0 &&
			this.compare("START_TO_END", elRange) <= 0 )	{
			return true;
		}
		// if our end is inside of elRange
		if(this.compare("END_TO_START", elRange) >= 0 &&
			endToEnd <= 0 )	{
			return true;
		}
		return false;
	},
	/**
	 * Collapses a range
	 * 
	 *     $('#foo').range().collapse()
	 * 
	 * @param {Boolean} [toStart] true if to the start of the range, false if to the
	 *  end.  Defaults to false.
	 * @return {jQuery.Range} returns the range for chaining.
	 */
	collapse : function(toStart){
		this.range.collapse(toStart === undefined ? true : toStart);
		return this;
	},
	/**
	 * Returns the text of the range.
	 * 
	 *     currentText = $.Range.current().toString()
	 * 
	 * @return {String} the text of the range
	 */
	toString : function(){
		return typeof this.range.text == "string"  ? this.range.text : this.range.toString();
	},
	/**
	 * Gets or sets the start of the range.
	 * 
	 * If a value is not provided, start returns the range's starting container and offset like:
	 * 
	 *     $('#foo').range().start() //-> {container: fooElement, offset: 0 } 
	 * 
	 * If a set value is provided, it can set the range.  The start of the range is set differently
	 * depending on the type of set value:
	 * 
	 *   - __Object__ - an object with the new starting container and offset is provided like
	 *     
	 *         $.Range().start({container:  $('#foo')[0], offset: 20})
	 *   
	 *   - __Number__ - the new offset value.  The container is kept the same.
	 *   
	 *   - __String__ - adjusts the offset by converting the string offset to a number and adding it to the current
	 *     offset.  For example, the following moves the offset forward four characters:
	 *                  
	 *         $('#foo').range().start("+4")
	 * 
	 * 
	 * @param {Object|String|Number} [set] a set value if setting the start of the range or nothing if reading it.
	 * @return {jQuery.Range|Object} if setting the start, the range is returned for chaining, otherwise, the 
	 *   start offset and container are returned.
	 */
	start : function(set){
		if(set === undefined){
			if(this.range.startContainer){
				return {
					container : this.range.startContainer,
					offset : this.range.startOffset
				}
			}else{
				var start = this.clone().collapse().parent();
				var startRange = $.Range(start).select(start).collapse();
				startRange.move("END_TO_START", this);
				return {
					container : start,
					offset : startRange.toString().length
				}
			}
		} else {
			if (this.range.setStart) {
				if(typeof set == 'number'){
					this.range.setStart(this.range.startContainer, set)
				} else if(typeof set == 'string') {
					this.range.setStart(this.range.startContainer, this.range.startOffset+ parseInt(set,10) );
				} else {
					this.range.setStart(set.container, set.offset)
				}
			} else {
				throw 'todo'
			}
			return this;
		}
		
		
	},
	/**
	 * Sets or gets the end of the range.  
	 * It takes similar options as [jQuery.Range.prototype.start].
	 * @param {Object} [set]
	 */
	end : function(set){
		if (set === undefined) {
			if (this.range.startContainer) {
				return {
					container: this.range.endContainer,
					offset: this.range.endOffset
				}
			}
			else {
				var end = this.clone().collapse(false).parent(),
					endRange = $.Range(end).select(end).collapse();
				endRange.move("END_TO_END", this);
				return {
					container: end,
					offset: endRange.toString().length
				}
			}
		} else {
			if (this.range.setEnd) {
				if(typeof set == 'number'){
					this.range.setEnd(this.range.endContainer, set)
				} else {
					this.range.setEnd(set.container, set.offset)
				}
			} else {
				throw 'todo'
			}
			return this;
		}
	},
	/**
	 * Returns the most common ancestor element of 
	 * the endpoints in the range. This will return text elements if the range is
	 * within a text element.
	 * @return {HTMLNode} the TextNode or HTMLElement
	 * that fully contains the range
	 */
	parent : function(){
		if(this.range.commonAncestorContainer){
			return this.range.commonAncestorContainer;
		} else {
			
			var parentElement = this.range.parentElement(),
				range = this.range;
			
			// IE's parentElement will always give an element, we want text ranges
			iterate(parentElement.childNodes, function(txtNode){
				if($.Range(txtNode).range.inRange( range ) ){
					// swap out the parentElement
					parentElement = txtNode;
					return false;
				}
			});
			
			return parentElement;
		}	
	},
	/**
	 * Returns the bounding rectangle of this range.
	 * 
	 * @param {String} [from] - where the coordinates should be 
	 * positioned from.  By default, coordinates are given from the client viewport.
	 * But if 'page' is given, they are provided relative to the page.
	 * 
	 * @return {TextRectangle} - The client rects.
	 */
	rect : function(from){
		var rect = this.range.getBoundingClientRect()
		if(from === 'page'){
			var off = scrollOffset();
			rect = $.extend({}, rect);
			rect.top += off.top;
			rect.left += off.left;
		}
		return rect;
	},
	/**
	 * Returns client rects
	 * @param {String} [from] how the rects coordinates should be given (viewport or page).  Provide 'page' for 
	 * rect coordinates from the page.
	 */
	rects : function(from){
		var rects = $.makeArray( this.range.getClientRects() ).sort(function(rect1, rect2){
			return  rect2.width*rect2.height - rect1.width*rect1.height;
		}),
			i=0,j,
			len = rects.length;
		//return rects;
		//rects are sorted, largest to smallest	
		while(i < rects.length){
			var cur = rects[i],
				found = false;
			
			j = i+1;
			for(j = i+1; j < rects.length; j++){
				if( withinRect(cur, rects[j] ) ) {
					found = rects[j];
					break;
				}
			}
			if(found){
				rects.splice(i,1)
			}else{
				i++;
			}
			
			
		}
		// safari will be return overlapping ranges ...
		if(from == 'page'){
			var off = scrollOffset();
			return $.map(rects, function(item){
				var i = $.extend({}, item)
				i.top += off.top;
				i.left += off.left;
				return i;
			})
		}
		
		
		return rects;
	}
	
});
(function(){
	//method branching ....
	var fn = $.Range.prototype,
		range = $.Range().range;
	
	/**
	 * @function compare
	 * Compares one range to another range.  
	 * 
	 * ## Example
	 * 
	 *     // compare the highlight element's start position
	 *     // to the start of the current range
	 *     $('#highlight')
	 *         .range()
	 *         .compare('START_TO_START', $.Range.current())
	 * 
	 * 
	 *
	 * @param {Object} type Specifies the boundry of the
	 * range and the <code>compareRange</code> to compare.
	 * 
	 *   - START\_TO\_START - the start of the range and the start of compareRange
	 *   - START\_TO\_END - the start of the range and the end of compareRange
	 *   - END\_TO\_END - the end of the range and the end of compareRange
	 *   - END\_TO\_START - the end of the range and the start of compareRange
	 *   
	 * @param {$.Range} compareRange The other range
	 * to compare against.
	 * @return {Number} a number indicating if the range
	 * boundary is before,
	 * after, or equal to <code>compareRange</code>'s 
	 * boundary where:
	 * 
	 *   - -1 - the range boundary comes before the compareRange boundary
	 *   - 0 - the boundaries are equal
	 *   - 1 - the range boundary comes after the compareRange boundary
	 */
	fn.compare = range.compareBoundaryPoints ? 
		function(type, range){
			return this.range.compareBoundaryPoints(this.window().Range[reverse( type )], range.range)
		}: 
		function(type, range){
			return this.range.compareEndPoints(convertType(type), range.range)
		}
	
	/**
	 * @function move
	 * Move the endpoints of a range relative to another range.
	 * 
	 *     // Move the current selection's end to the 
	 *     // end of the #highlight element
	 *     $.Range.current().move('END_TO_END',
	 *       $('#highlight').range() )
	 *                            
	 * 
	 * @param {String} type a string indicating the ranges boundary point
	 * to move to which referenceRange boundary point where:
	 * 
	 *   - START\_TO\_START - the start of the range moves to the start of referenceRange
	 *   - START\_TO\_END - the start of the range move to the end of referenceRange
	 *   - END\_TO\_END - the end of the range moves to the end of referenceRange
	 *   - END\_TO\_START - the end of the range moves to the start of referenceRange
	 *   
	 * @param {jQuery.Range} referenceRange
	 * @return {jQuery.Range} the original range for chaining
	 */
	fn.move = range.setStart ? 
		function(type, range){
	
			var rangesRange = range.range;
			switch(type){
				case "START_TO_END" : 
					this.range.setStart(rangesRange.endContainer, rangesRange.endOffset)
					break;
				case "START_TO_START" : 
					this.range.setStart(rangesRange.startContainer, rangesRange.startOffset)
					break;
				case "END_TO_END" : 
					this.range.setEnd(rangesRange.endContainer, rangesRange.endOffset)
					break;
				case "END_TO_START" : 
					this.range.setEnd(rangesRange.startContainer, rangesRange.startOffset)
					break;
			}
			
			return this;
		}:
		function(type, range){			
			this.range.setEndPoint(convertType(type), range.range)
			return this;
		};
	var cloneFunc = range.cloneRange ? "cloneRange" : "duplicate",
		selectFunc = range.selectNodeContents ? "selectNodeContents" : "moveToElementText";
	
	fn.
	/**
	 * Clones the range and returns a new $.Range 
	 * object.
	 * 
	 * @return {jQuery.Range} returns the range as a $.Range.
	 */
	clone = function(){
		return $.Range( this.range[cloneFunc]() );
	};
	
	fn.
	/**
	 * @function
	 * Selects an element with this range.  If nothing 
	 * is provided, makes the current
	 * range appear as if the user has selected it.
	 * 
	 * This works with text nodes.
	 * 
	 * @param {HTMLElement} [el]
	 * @return {jQuery.Range} the range for chaining.
	 */
	select = range.selectNodeContents ? function(el){
		if(!el){
			this.window().getSelection().addRange(this.range);
		}else {
			this.range.selectNodeContents(el);
		}
		return this;
	} : function(el){
		if(!el){
			this.range.select()
		} else if(el.nodeType === 3){
			//select this node in the element ...
			var parent = el.parentNode,
				start = 0,
				end;
			iterate(parent.childNodes, function(txtNode){
				if(txtNode === el){
					end = start + txtNode.nodeValue.length;
					return false;
				} else {
					start = start + txtNode.nodeValue.length
				}
			})
			this.range.moveToElementText(parent);
			
			this.range.moveEnd('character', end - this.range.text.length)
			this.range.moveStart('character', start);
		} else { 
			this.range.moveToElementText(el);
		}
		return this;
	};
	
})();


// helpers  -----------------

// iterates through a list of elements, calls cb on every text node
// if cb returns false, exits the iteration
var iterate = function(elems, cb){
	var elem, start;
	for (var i = 0; elems[i]; i++) {
		elem = elems[i];
		// Get the text from text nodes and CDATA nodes
		if (elem.nodeType === 3 || elem.nodeType === 4) {
			if (cb(elem) === false) {
				return false;
			}
			// Traverse everything else, except comment nodes
		}
		else 
			if (elem.nodeType !== 8) {
				if (iterate(elem.childNodes, cb) === false) {
					return false;
				}
			}
	}

}, 
supportWhitespace,
isWhitespace = function(el){
	if(supportWhitespace == null){
		supportWhitespace = 'isElementContentWhitespace' in el;
	}
	return (supportWhitespace? el.isElementContentWhitespace : 
			(el.nodeType === 3 && '' == el.data.trim()));

}, 
// if a point is within a rectangle
within = function(rect, point){

	return rect.left <= point.clientX && rect.left + rect.width >= point.clientX &&
	rect.top <= point.clientY &&
	rect.top + rect.height >= point.clientY
}, 
// if a rectangle is within another rectangle
withinRect = function(outer, inner){
	return within(outer, {
		clientX: inner.left,
		clientY: inner.top
	}) && //top left
	within(outer, {
		clientX: inner.left + inner.width,
		clientY: inner.top
	}) && //top right
	within(outer, {
		clientX: inner.left,
		clientY: inner.top + inner.height
	}) && //bottom left
	within(outer, {
		clientX: inner.left + inner.width,
		clientY: inner.top + inner.height
	}) //bottom right
}, 
// gets the scroll offset from a window
scrollOffset = function( win){
	var win = win ||window;
		doc = win.document.documentElement, body = win.document.body;
	
	return {
		left: (doc && doc.scrollLeft || body && body.scrollLeft || 0) + (doc.clientLeft || 0),
		top: (doc && doc.scrollTop || body && body.scrollTop || 0) + (doc.clientTop || 0)
	};
};


support.moveToPoint = !!$.Range().range.moveToPoint


})(jQuery);
