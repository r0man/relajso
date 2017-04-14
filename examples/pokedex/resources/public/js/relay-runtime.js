/**
 * Relay vundefined
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("promise"));
	else if(typeof define === 'function' && define.amd)
		define(["promise"], factory);
	else if(typeof exports === 'object')
		exports["RelayRuntime"] = factory(require("promise"));
	else
		root["RelayRuntime"] = factory(root["promise"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_180__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRuntime
	 * 
	 */

	'use strict';

	/**
	 * The public interface to Relay Runtime.
	 */
	module.exports = {
	  // Core API
	  Environment: __webpack_require__(71),
	  Network: __webpack_require__(100),
	  RecordSource: __webpack_require__(24),
	  Store: __webpack_require__(99),

	  areEqualSelectors: __webpack_require__(14).areEqualSelectors,
	  createFragmentSpecResolver: __webpack_require__(14).createFragmentSpecResolver,
	  createOperationSelector: __webpack_require__(14).createOperationSelector,
	  getDataIDsFromObject: __webpack_require__(14).getDataIDsFromObject,
	  getFragment: __webpack_require__(31).getFragment,
	  getOperation: __webpack_require__(31).getOperation,
	  getSelector: __webpack_require__(14).getSelector,
	  getSelectorList: __webpack_require__(14).getSelectorList,
	  getSelectorsFromObject: __webpack_require__(14).getSelectorsFromObject,
	  getVariablesFromObject: __webpack_require__(14).getVariablesFromObject,
	  graphql: __webpack_require__(31).graphql,

	  // Extensions
	  ConnectionHandler: __webpack_require__(95),
	  ViewerHandler: __webpack_require__(109),

	  // Helpers (can be implemented via the above API)
	  commitLocalUpdate: __webpack_require__(110),
	  commitMutation: __webpack_require__(111),
	  fetchQuery: __webpack_require__(112),
	  isRelayStaticEnvironment: __webpack_require__(74),
	  requestSubscription: __webpack_require__(116)
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var validateFormat = function validateFormat(format) {};

	if (true) {
	  validateFormat = function validateFormat(format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}

	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	}

	module.exports = invariant;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStaticRecord
	 * 
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(28));

	var _assign2 = _interopRequireDefault(__webpack_require__(47));

	var _keys2 = _interopRequireDefault(__webpack_require__(27));

	var _stringify2 = _interopRequireDefault(__webpack_require__(18));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    ID_KEY = _require.ID_KEY,
	    REF_KEY = _require.REF_KEY,
	    REFS_KEY = _require.REFS_KEY,
	    TYPENAME_KEY = _require.TYPENAME_KEY;

	/**
	 * @public
	 *
	 * Low-level record manipulation methods.
	 *
	 * A note about perf: we use long-hand property access rather than computed
	 * properties in this file for speed ie.
	 *
	 *    const object = {};
	 *    object[KEY] = value;
	 *    record[storageKey] = object;
	 *
	 * instead of:
	 *
	 *    record[storageKey] = {
	 *      [KEY]: value,
	 *    };
	 *
	 * The latter gets transformed by Babel into something like:
	 *
	 *    function _defineProperty(obj, key, value) {
	 *      if (key in obj) {
	 *        Object.defineProperty(obj, key, {
	 *          value: value,
	 *          enumerable: true,
	 *          configurable: true,
	 *          writable: true,
	 *        });
	 *      } else {
	 *        obj[key] = value;
	 *      }
	 *      return obj;
	 *    }
	 *
	 *    record[storageKey] = _defineProperty({}, KEY, value);
	 *
	 * A quick benchmark shows that computed property access is an order of
	 * magnitude slower (times in seconds for 100,000 iterations):
	 *
	 *               best     avg     sd
	 *    computed 0.02175 0.02292 0.00113
	 *      manual 0.00110 0.00123 0.00008
	 */

	/**
	 * @public
	 *
	 * Clone a record.
	 */
	function clone(record) {
	  return (0, _extends3['default'])({}, record);
	}

	/**
	 * @public
	 *
	 * Copies all fields from `source` to `sink`, excluding `__id` and `__typename`.
	 *
	 * NOTE: This function does not treat `id` specially. To preserve the id,
	 * manually reset it after calling this function. Also note that values are
	 * copied by reference and not value; callers should ensure that values are
	 * copied on write.
	 */
	function copyFields(source, sink) {
	  __webpack_require__(13)(source, function (value, key) {
	    if (key !== ID_KEY && key !== TYPENAME_KEY) {
	      sink[key] = value;
	    }
	  });
	}

	/**
	 * @public
	 *
	 * Create a new record.
	 */
	function create(dataID, typeName) {
	  // See perf note above for why we aren't using computed property access.
	  var record = {};
	  record[ID_KEY] = dataID;
	  record[TYPENAME_KEY] = typeName;
	  return record;
	}

	/**
	 * @public
	 *
	 * Get the record's `id` if available or the client-generated identifier.
	 */
	function getDataID(record) {
	  return record[ID_KEY];
	}

	/**
	 * @public
	 *
	 * Get the concrete type of the record.
	 */
	function getType(record) {
	  return record[TYPENAME_KEY];
	}

	/**
	 * @public
	 *
	 * Get a scalar (non-link) field value.
	 */
	function getValue(record, storageKey) {
	  var value = record[storageKey];
	  if (value && typeof value === 'object') {
	    __webpack_require__(1)(!value.hasOwnProperty(REF_KEY) && !value.hasOwnProperty(REFS_KEY), 'RelayStaticRecord.getValue(): Expected a scalar (non-link) value for `%s.%s` ' + 'but found %s.', record[ID_KEY], storageKey, value.hasOwnProperty(REF_KEY) ? 'a linked record' : 'plural linked records');
	  }
	  return value;
	}

	/**
	 * @public
	 *
	 * Get the value of a field as a reference to another record. Throws if the
	 * field has a different type.
	 */
	function getLinkedRecordID(record, storageKey) {
	  var link = record[storageKey];
	  if (link == null) {
	    return link;
	  }
	  __webpack_require__(1)(typeof link === 'object' && link && typeof link[REF_KEY] === 'string', 'RelayStaticRecord.getLinkedRecordID(): Expected `%s.%s` to be a linked ID, ' + 'was `%s`.', record[ID_KEY], storageKey, link);
	  return link[REF_KEY];
	}

	/**
	 * @public
	 *
	 * Get the value of a field as a list of references to other records. Throws if
	 * the field has a different type.
	 */
	function getLinkedRecordIDs(record, storageKey) {
	  var links = record[storageKey];
	  if (links == null) {
	    return links;
	  }
	  __webpack_require__(1)(typeof links === 'object' && Array.isArray(links[REFS_KEY]), 'RelayStaticRecord.getLinkedRecordIDs(): Expected `%s.%s` to contain an array ' + 'of linked IDs, got `%s`.', record[ID_KEY], storageKey, (0, _stringify2['default'])(links));
	  // assume items of the array are ids
	  return links[REFS_KEY];
	}

	/**
	 * @public
	 *
	 * Compares the fields of a previous and new record, returning either the
	 * previous record if all fields are equal or a new record (with merged fields)
	 * if any fields have changed.
	 */
	function update(prevRecord, nextRecord) {
	  var updated = void 0;
	  var keys = (0, _keys2['default'])(nextRecord);
	  for (var ii = 0; ii < keys.length; ii++) {
	    var key = keys[ii];
	    if (updated || !__webpack_require__(66)(prevRecord[key], nextRecord[key])) {
	      updated = updated || (0, _extends3['default'])({}, prevRecord);
	      updated[key] = nextRecord[key];
	    }
	  }
	  return updated || prevRecord;
	}

	/**
	 * @public
	 *
	 * Returns a new record with the contents of the given records. Fields in the
	 * second record will overwrite identical fields in the first record.
	 */
	function merge(record1, record2) {
	  return (0, _assign2['default'])({}, record1, record2);
	}

	/**
	 * @public
	 *
	 * Prevent modifications to the record. Attempts to call `set*` functions on a
	 * frozen record will fatal at runtime.
	 */
	function freeze(record) {
	  __webpack_require__(44)(record);
	}

	/**
	 * @public
	 *
	 * Set the value of a storageKey to a scalar.
	 */
	function setValue(record, storageKey, value) {
	  record[storageKey] = value;
	}

	/**
	 * @public
	 *
	 * Set the value of a field to a reference to another record.
	 */
	function setLinkedRecordID(record, storageKey, linkedID) {
	  // See perf note above for why we aren't using computed property access.
	  var link = {};
	  link[REF_KEY] = linkedID;
	  record[storageKey] = link;
	}

	/**
	 * @public
	 *
	 * Set the value of a field to a list of references other records.
	 */
	function setLinkedRecordIDs(record, storageKey, linkedIDs) {
	  // See perf note above for why we aren't using computed property access.
	  var links = {};
	  links[REFS_KEY] = linkedIDs;
	  record[storageKey] = links;
	}

	module.exports = {
	  clone: clone,
	  copyFields: copyFields,
	  create: create,
	  freeze: freeze,
	  getDataID: getDataID,
	  getLinkedRecordID: getLinkedRecordID,
	  getLinkedRecordIDs: getLinkedRecordIDs,
	  getType: getType,
	  getValue: getValue,
	  merge: merge,
	  setValue: setValue,
	  setLinkedRecordID: setLinkedRecordID,
	  setLinkedRecordIDs: setLinkedRecordIDs,
	  update: update
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayConcreteNode
	 * 
	 */

	'use strict';

	/**
	 * Represents a single ConcreteRoot along with metadata for processing it at
	 * runtime. The persisted `id` (or `text`) can be used to fetch the query,
	 * the `fragment` can be used to read the root data (masking data from child
	 * fragments), and the `query` can be used to normalize server responses.
	 *
	 * NOTE: The use of "batch" in the name is intentional, as this wrapper around
	 * the ConcreteRoot will provide a place to store multiple concrete nodes that
	 * are part of the same batch, e.g. in the case of deferred nodes or
	 * for streaming connections that are represented as distinct concrete roots but
	 * are still conceptually tied to one source query.
	 */
	var RelayConcreteNode = {
	  CONDITION: 'Condition',
	  FRAGMENT: 'Fragment',
	  FRAGMENT_SPREAD: 'FragmentSpread',
	  INLINE_FRAGMENT: 'InlineFragment',
	  LINKED_FIELD: 'LinkedField',
	  LINKED_HANDLE: 'LinkedHandle',
	  LITERAL: 'Literal',
	  LOCAL_ARGUMENT: 'LocalArgument',
	  ROOT: 'Root',
	  ROOT_ARGUMENT: 'RootArgument',
	  SCALAR_FIELD: 'ScalarField',
	  SCALAR_HANDLE: 'ScalarHandle',
	  VARIABLE: 'Variable'
	};

	module.exports = RelayConcreteNode;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStoreUtils
	 * 
	 */

	'use strict';

	var _freeze2 = _interopRequireDefault(__webpack_require__(76));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var VARIABLE = __webpack_require__(3).VARIABLE;

	/**
	 * Returns the values of field/fragment arguments as an object keyed by argument
	 * names.
	 */


	function getArgumentValues(args, variables) {
	  var values = {};
	  args.forEach(function (arg) {
	    if (arg.kind === VARIABLE) {
	      values[arg.name] = getVariableValue(arg.variableName, variables);
	    } else {
	      values[arg.name] = arg.value;
	    }
	  });
	  return values;
	}

	function getHandleFilterValues(args, filters, variables) {
	  var filterArgs = args.filter(function (arg) {
	    return filters.indexOf(arg.name) > -1;
	  });
	  return getArgumentValues(filterArgs, variables);
	}

	/**
	 * Given a field and variable values, returns a key that can be used to
	 * uniquely identify the combination of the field name and argument values.
	 *
	 * Note: the word "storage" here refers to the fact this key is primarily used
	 * when writing the results of a key in a normalized graph or "store". This
	 * name was used in previous implementations of Relay internals and is also
	 * used here for consistency.
	 */
	function getStorageKey(field, variables) {
	  if (field.storageKey) {
	    return field.storageKey;
	  }
	  var args = field.args,
	      name = field.name;

	  if (!args || !args.length) {
	    return name;
	  }
	  var values = [];
	  args.forEach(function (arg) {
	    var value = void 0;
	    if (arg.kind === VARIABLE) {
	      value = getVariableValue(arg.variableName, variables);
	    } else {
	      value = arg.value;
	    }
	    if (value != null) {
	      values.push('"' + arg.name + '":' + __webpack_require__(75)(value));
	    }
	  });
	  if (values.length) {
	    return field.name + ('{' + values.join(',') + '}');
	  } else {
	    return field.name;
	  }
	}

	function getVariableValue(name, variables) {
	  __webpack_require__(1)(variables.hasOwnProperty(name), 'getVariableValue(): Undefined variable `%s`.', name);
	  return variables[name];
	}

	/**
	 * Constants shared by all implementations of RecordSource/MutableRecordSource/etc.
	 */
	var RelayStoreUtils = {
	  FRAGMENTS_KEY: '__fragments',
	  ID_KEY: '__id',
	  REF_KEY: '__ref',
	  REFS_KEY: '__refs',
	  ROOT_ID: 'client:root',
	  ROOT_TYPE: '__Root',
	  TYPENAME_KEY: '__typename',
	  UNPUBLISH_RECORD_SENTINEL: (0, _freeze2['default'])({ __UNPUBLISH_RECORD_SENTINEL: true }),

	  getArgumentValues: getArgumentValues,
	  getStorageKey: getStorageKey,
	  getHandleFilterValues: getHandleFilterValues
	};

	module.exports = RelayStoreUtils;

/***/ },
/* 5 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(57)('wks')
	  , uid        = __webpack_require__(40)
	  , Symbol     = __webpack_require__(11).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule formatStorageKey
	 * 
	 */

	'use strict';

	/**
	 * Given a `fieldName` (eg. "foo") and an object representing arguments and
	 * values (eg. `{first: 10, orberBy: "name"}`) returns a unique storage key
	 * (ie. `foo{"first":10,"orderBy":"name"}`).
	 */
	function formatStorageKey(fieldName, argsWithValues) {
	  if (!argsWithValues) {
	    return fieldName;
	  }
	  var filtered = null;
	  __webpack_require__(13)(argsWithValues, function (value, argName) {
	    if (value != null) {
	      if (!filtered) {
	        filtered = {};
	      }
	      filtered[argName] = value;
	    }
	  });
	  return fieldName + (filtered ? __webpack_require__(75)(filtered) : '');
	}

	module.exports = formatStorageKey;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(20)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(5)
	  , ctx       = __webpack_require__(29)
	  , hide      = __webpack_require__(17)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(19)
	  , IE8_DOM_DEFINE = __webpack_require__(84)
	  , toPrimitive    = __webpack_require__(60)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(9) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * Executes the provided `callback` once for each enumerable own property in the
	 * object. The `callback` is invoked with three arguments:
	 *
	 *  - the property value
	 *  - the property name
	 *  - the object being traversed
	 *
	 * Properties that are added after the call to `forEachObject` will not be
	 * visited by `callback`. If the values of existing properties are changed, the
	 * value passed to `callback` will be the value at the time `forEachObject`
	 * visits them. Properties that are deleted before being visited are not
	 * visited.
	 *
	 * @param {?object} object
	 * @param {function} callback
	 * @param {*} context
	 */
	function forEachObject(object, callback, context) {
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name)) {
	      callback.call(context, object[name], name, object);
	    }
	  }
	}

	module.exports = forEachObject;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayCore
	 * 
	 */

	'use strict';

	var _require = __webpack_require__(31),
	    getFragment = _require.getFragment,
	    getOperation = _require.getOperation;

	var _require2 = __webpack_require__(108),
	    createOperationSelector = _require2.createOperationSelector;

	var _require3 = __webpack_require__(72),
	    areEqualSelectors = _require3.areEqualSelectors,
	    getDataIDsFromObject = _require3.getDataIDsFromObject,
	    getSelector = _require3.getSelector,
	    getSelectorList = _require3.getSelectorList,
	    getSelectorsFromObject = _require3.getSelectorsFromObject,
	    getVariablesFromObject = _require3.getVariablesFromObject;

	function createFragmentSpecResolver(context, fragments, props, callback) {
	  return new (__webpack_require__(107))(context, fragments, props, callback);
	}

	module.exports = {
	  areEqualSelectors: areEqualSelectors,
	  createFragmentSpecResolver: createFragmentSpecResolver,
	  createOperationSelector: createOperationSelector,
	  getDataIDsFromObject: getDataIDsFromObject,
	  getFragment: getFragment,
	  getOperation: getOperation,
	  getSelector: getSelector,
	  getSelectorList: getSelectorList,
	  getSelectorsFromObject: getSelectorsFromObject,
	  getVariablesFromObject: getVariablesFromObject
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule generateRelayClientID
	 * 
	 */

	'use strict';

	var PREFIX = 'client:';

	function generateRelayClientID(id, storageKey, index) {
	  var key = id + ':' + storageKey;
	  if (index != null) {
	    key += ':' + index;
	  }
	  if (!key.startsWith(PREFIX)) {
	    key = PREFIX + key;
	  }
	  return key;
	}

	module.exports = generateRelayClientID;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(12)
	  , createDesc = __webpack_require__(37);
	module.exports = __webpack_require__(9) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(128), __esModule: true };

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(15);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(52)
	  , defined = __webpack_require__(32);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	'use strict';

	var emptyFunction = __webpack_require__(41);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (true) {
	  (function () {
	    var printWarning = function printWarning(format) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch (x) {}
	    };

	    warning = function warning(condition, format) {
	      if (format === undefined) {
	        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
	      }

	      if (format.indexOf('Failed Composite propType: ') === 0) {
	        return; // Ignore CompositeComponent proptype check.
	      }

	      if (!condition) {
	        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	          args[_key2 - 2] = arguments[_key2];
	        }

	        printWarning.apply(undefined, [format].concat(args));
	      }
	    };
	  })();
	}

	module.exports = warning;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayInMemoryRecordSource
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _keys2 = _interopRequireDefault(__webpack_require__(27));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var EXISTENT = __webpack_require__(26).EXISTENT,
	    NONEXISTENT = __webpack_require__(26).NONEXISTENT,
	    UNKNOWN = __webpack_require__(26).UNKNOWN;

	/**
	 * An implementation of the `MutableRecordSource` interface (defined in
	 * `RelayStoreTypes`) that holds all records in memory.
	 */


	var RelayInMemoryRecordSource = function () {
	  function RelayInMemoryRecordSource(records) {
	    (0, _classCallCheck3['default'])(this, RelayInMemoryRecordSource);

	    this._records = records || {};
	  }

	  RelayInMemoryRecordSource.prototype.clear = function clear() {
	    this._records = {};
	  };

	  RelayInMemoryRecordSource.prototype['delete'] = function _delete(dataID) {
	    this._records[dataID] = null;
	  };

	  RelayInMemoryRecordSource.prototype.get = function get(dataID) {
	    return this._records[dataID];
	  };

	  RelayInMemoryRecordSource.prototype.getRecordIDs = function getRecordIDs() {
	    return (0, _keys2['default'])(this._records);
	  };

	  RelayInMemoryRecordSource.prototype.getStatus = function getStatus(dataID) {
	    if (!this._records.hasOwnProperty(dataID)) {
	      return UNKNOWN;
	    }
	    return this._records[dataID] == null ? NONEXISTENT : EXISTENT;
	  };

	  RelayInMemoryRecordSource.prototype.has = function has(dataID) {
	    return this._records.hasOwnProperty(dataID);
	  };

	  RelayInMemoryRecordSource.prototype.load = function load(dataID, callback) {
	    callback(null, this.get(dataID));
	  };

	  RelayInMemoryRecordSource.prototype.remove = function remove(dataID) {
	    delete this._records[dataID];
	  };

	  RelayInMemoryRecordSource.prototype.set = function set(dataID, record) {
	    this._records[dataID] = record;
	  };

	  RelayInMemoryRecordSource.prototype.size = function size() {
	    return (0, _keys2['default'])(this._records).length;
	  };

	  RelayInMemoryRecordSource.prototype.toJSON = function toJSON() {
	    return this._records;
	  };

	  return RelayInMemoryRecordSource;
	}();

	module.exports = RelayInMemoryRecordSource;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(90)
	  , enumBugKeys = __webpack_require__(50);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRecordState
	 * 
	 */

	'use strict';

	var RelayRecordState = {
	  /**
	   * Record exists (either fetched from the server or produced by a local,
	   * optimistic update).
	   */
	  EXISTENT: 'EXISTENT',

	  /**
	   * Record is known not to exist (either as the result of a mutation, or
	   * because the server returned `null` when queried for the record).
	   */
	  NONEXISTENT: 'NONEXISTENT',

	  /**
	   * Record State is unknown because it has not yet been fetched from the
	   * server.
	   */
	  UNKNOWN: 'UNKNOWN'
	};

	module.exports = RelayRecordState;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(136), __esModule: true };

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(47);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(141);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStaticGraphQLTag
	 * 
	 */

	'use strict';

	var _stringify2 = _interopRequireDefault(__webpack_require__(18));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * Runtime function to correspond to the `graphql` tagged template function.
	 * All calls to this function should be transformed by the plugin.
	 */


	// The type of a graphql`...` tagged template expression.
	function graphql() {
	  __webpack_require__(1)(false, 'graphql: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `graphql`.');
	}

	/**
	 * Variant of the `graphql` tag that enables experimental features.
	 */
	graphql.experimental = function () {
	  __webpack_require__(1)(false, 'graphql.experimental: Unexpected invocation at runtime. Either the ' + 'Babel transform was not set up, or it failed to identify this call ' + 'site. Make sure it is being used verbatim as `graphql`.');
	};

	function getNode(taggedNode) {
	  var fn = typeof taggedNode === 'function' ? taggedNode
	  // Note: this is a temporary "push safe" fix so existing built files
	  // referencing "node.relayExperimental" continue to work.
	  : taggedNode.modern || taggedNode.relayExperimental;
	  // Support for classic raw nodes (used in test mock)
	  if (typeof fn !== 'function') {
	    return taggedNode;
	  }
	  return fn();
	}

	function getFragment(taggedNode) {
	  var fragment = getNode(taggedNode);
	  __webpack_require__(1)(typeof fragment === 'object' && fragment !== null && fragment.kind === 'Fragment', 'RelayStaticGraphQLTag: Expected a fragment, got `%s`.', (0, _stringify2['default'])(fragment));
	  return fragment;
	}

	function getOperation(taggedNode) {
	  var operation = getNode(taggedNode);
	  __webpack_require__(1)(typeof operation === 'object' && operation !== null && operation.kind === 'Batch', 'RelayStaticGraphQLTag: Expected an operation, got `%s`.', (0, _stringify2['default'])(operation));
	  return operation;
	}

	module.exports = {
	  getFragment: getFragment,
	  getOperation: getOperation,
	  graphql: graphql
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(40)('meta')
	  , isObject = __webpack_require__(15)
	  , has      = __webpack_require__(21)
	  , setDesc  = __webpack_require__(12).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(20)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(19)
	  , dPs         = __webpack_require__(155)
	  , enumBugKeys = __webpack_require__(50)
	  , IE_PROTO    = __webpack_require__(56)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(83)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(149).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10)
	  , core    = __webpack_require__(5)
	  , fails   = __webpack_require__(20);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(12).f
	  , has = __webpack_require__(21)
	  , TAG = __webpack_require__(7)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(32);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	function makeEmptyFunction(arg) {
	  return function () {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	var emptyFunction = function emptyFunction() {};

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function () {
	  return this;
	};
	emptyFunction.thatReturnsArgument = function (arg) {
	  return arg;
	};

	module.exports = emptyFunction;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRecordSourceMutator
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(26),
	    EXISTENT = _require.EXISTENT;

	var _require2 = __webpack_require__(4),
	    UNPUBLISH_RECORD_SENTINEL = _require2.UNPUBLISH_RECORD_SENTINEL;

	/**
	 * @internal
	 *
	 * Wrapper API that is an amalgam of the `RelayStaticRecord` API and
	 * `MutableRecordSource` interface, implementing copy-on-write semantics for
	 * records in a record source. If a `backup` is supplied, the mutator will
	 * ensure that the backup contains sufficient information to revert all
	 * modifications by publishing the backup.
	 *
	 * Modifications are applied to fresh copies of records with optional backups
	 * created:
	 * - Records in `base` are never modified.
	 * - Modifications cause a fresh version of a record to be created in `sink`.
	 *   These sink records contain only modified fields.
	 * - If a `backup` is supplied, any modifications to a record will cause the
	 *   sink version of the record to be added to the backup.
	 * - Creation of a record causes a sentinel object to be added to the backup
	 *   so that the new record can be removed from the store by publishing the
	 *   backup.
	 */
	var RelayRecordSourceMutator = function () {
	  function RelayRecordSourceMutator(base, sink, backup) {
	    (0, _classCallCheck3['default'])(this, RelayRecordSourceMutator);

	    this._backup = backup;
	    this._base = base;
	    this._sink = sink;
	    this._sources = [sink, base];
	  }

	  RelayRecordSourceMutator.prototype._createBackupRecord = function _createBackupRecord(dataID) {
	    var backup = this._backup;
	    if (backup && !backup.has(dataID)) {
	      var baseRecord = this._base.get(dataID);
	      if (baseRecord != null) {
	        backup.set(dataID, baseRecord);
	      } else if (baseRecord === null) {
	        backup['delete'](dataID);
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype._getSinkRecord = function _getSinkRecord(dataID) {
	    var sinkRecord = this._sink.get(dataID);
	    if (!sinkRecord) {
	      var baseRecord = this._base.get(dataID);
	      __webpack_require__(1)(baseRecord, 'RelayRecordSourceMutator: Cannot modify non-existent record `%s`.', dataID);
	      sinkRecord = __webpack_require__(2).create(dataID, __webpack_require__(2).getType(baseRecord));
	      this._sink.set(dataID, sinkRecord);
	    }
	    return sinkRecord;
	  };

	  RelayRecordSourceMutator.prototype.copyFields = function copyFields(sourceID, sinkID) {
	    var sinkSource = this._sink.get(sourceID);
	    var baseSource = this._base.get(sourceID);
	    __webpack_require__(1)(sinkSource || baseSource, 'RelayRecordSourceMutator#copyFields(): Cannot copy fields from ' + 'non-existent record `%s`.', sourceID);
	    this._createBackupRecord(sinkID);
	    var sink = this._getSinkRecord(sinkID);
	    if (baseSource) {
	      __webpack_require__(2).copyFields(baseSource, sink);
	    }
	    if (sinkSource) {
	      __webpack_require__(2).copyFields(sinkSource, sink);
	    }
	  };

	  RelayRecordSourceMutator.prototype.copyFieldsFromRecord = function copyFieldsFromRecord(record, sinkID) {
	    this.copyFields(__webpack_require__(2).getDataID(record), sinkID);
	    var sink = this._getSinkRecord(sinkID);
	    __webpack_require__(2).copyFields(record, sink);
	  };

	  RelayRecordSourceMutator.prototype.create = function create(dataID, typeName) {
	    __webpack_require__(1)(this._base.getStatus(dataID) !== EXISTENT && this._sink.getStatus(dataID) !== EXISTENT, 'RelayRecordSourceMutator#create(): Cannot create a record with id ' + '`%s`, this record already exists.', dataID);
	    if (this._backup) {
	      this._backup.set(dataID, UNPUBLISH_RECORD_SENTINEL);
	    }
	    var record = __webpack_require__(2).create(dataID, typeName);
	    this._sink.set(dataID, record);
	  };

	  RelayRecordSourceMutator.prototype['delete'] = function _delete(dataID) {
	    this._createBackupRecord(dataID);
	    this._sink['delete'](dataID);
	  };

	  RelayRecordSourceMutator.prototype.getStatus = function getStatus(dataID) {
	    return this._sink.has(dataID) ? this._sink.getStatus(dataID) : this._base.getStatus(dataID);
	  };

	  RelayRecordSourceMutator.prototype.getType = function getType(dataID) {
	    for (var ii = 0; ii < this._sources.length; ii++) {
	      var record = this._sources[ii].get(dataID);
	      if (record) {
	        return __webpack_require__(2).getType(record);
	      } else if (record === null) {
	        return null;
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype.getValue = function getValue(dataID, storageKey) {
	    for (var ii = 0; ii < this._sources.length; ii++) {
	      var record = this._sources[ii].get(dataID);
	      if (record) {
	        var value = __webpack_require__(2).getValue(record, storageKey);
	        if (value !== undefined) {
	          return value;
	        }
	      } else if (record === null) {
	        return null;
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype.setValue = function setValue(dataID, storageKey, value) {
	    this._createBackupRecord(dataID);
	    var sinkRecord = this._getSinkRecord(dataID);
	    __webpack_require__(2).setValue(sinkRecord, storageKey, value);
	  };

	  RelayRecordSourceMutator.prototype.getLinkedRecordID = function getLinkedRecordID(dataID, storageKey) {
	    for (var ii = 0; ii < this._sources.length; ii++) {
	      var record = this._sources[ii].get(dataID);
	      if (record) {
	        var linkedID = __webpack_require__(2).getLinkedRecordID(record, storageKey);
	        if (linkedID !== undefined) {
	          return linkedID;
	        }
	      } else if (record === null) {
	        return null;
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype.setLinkedRecordID = function setLinkedRecordID(dataID, storageKey, linkedID) {
	    this._createBackupRecord(dataID);
	    var sinkRecord = this._getSinkRecord(dataID);
	    __webpack_require__(2).setLinkedRecordID(sinkRecord, storageKey, linkedID);
	  };

	  RelayRecordSourceMutator.prototype.getLinkedRecordIDs = function getLinkedRecordIDs(dataID, storageKey) {
	    for (var ii = 0; ii < this._sources.length; ii++) {
	      var record = this._sources[ii].get(dataID);
	      if (record) {
	        var linkedIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);
	        if (linkedIDs !== undefined) {
	          return linkedIDs;
	        }
	      } else if (record === null) {
	        return null;
	      }
	    }
	  };

	  RelayRecordSourceMutator.prototype.setLinkedRecordIDs = function setLinkedRecordIDs(dataID, storageKey, linkedIDs) {
	    this._createBackupRecord(dataID);
	    var sinkRecord = this._getSinkRecord(dataID);
	    __webpack_require__(2).setLinkedRecordIDs(sinkRecord, storageKey, linkedIDs);
	  };

	  return RelayRecordSourceMutator;
	}();

	module.exports = RelayRecordSourceMutator;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRecordSourceProxy
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(26),
	    EXISTENT = _require.EXISTENT,
	    NONEXISTENT = _require.NONEXISTENT;

	var _require2 = __webpack_require__(4),
	    ROOT_ID = _require2.ROOT_ID,
	    ROOT_TYPE = _require2.ROOT_TYPE;

	/**
	 * @internal
	 *
	 * A helper for manipulating a `RecordSource` via an imperative/OO-style API.
	 */
	var RelayRecordSourceProxy = function () {
	  function RelayRecordSourceProxy(mutator, handlerProvider) {
	    (0, _classCallCheck3['default'])(this, RelayRecordSourceProxy);

	    this._mutator = mutator;
	    this._handlerProvider = handlerProvider || null;
	    this._proxies = {};
	  }

	  RelayRecordSourceProxy.prototype.commitPayload = function commitPayload(selector, response) {
	    var _this = this;

	    var _normalizeRelayPayloa = __webpack_require__(46)(selector, response),
	        source = _normalizeRelayPayloa.source,
	        fieldPayloads = _normalizeRelayPayloa.fieldPayloads;

	    var dataIDs = source.getRecordIDs();
	    dataIDs.forEach(function (dataID) {
	      var status = source.getStatus(dataID);
	      if (status === EXISTENT) {
	        var sourceRecord = source.get(dataID);
	        if (sourceRecord) {
	          if (_this._mutator.getStatus(dataID) !== EXISTENT) {
	            _this.create(dataID, __webpack_require__(2).getType(sourceRecord));
	          }
	          _this._mutator.copyFieldsFromRecord(sourceRecord, dataID);
	          delete _this._proxies[dataID];
	        }
	      } else if (status === NONEXISTENT) {
	        _this['delete'](dataID);
	      }
	    });

	    if (fieldPayloads && fieldPayloads.length) {
	      fieldPayloads.forEach(function (fieldPayload) {
	        var handler = _this._handlerProvider && _this._handlerProvider(fieldPayload.handle);
	        __webpack_require__(1)(handler, 'RelayStaticEnvironment: Expected a handler to be provided for handle `%s`.', fieldPayload.handle);
	        handler.update(_this, fieldPayload);
	      });
	    }
	  };

	  RelayRecordSourceProxy.prototype.create = function create(dataID, typeName) {
	    this._mutator.create(dataID, typeName);
	    delete this._proxies[dataID];
	    var record = this.get(dataID);
	    // For flow
	    __webpack_require__(1)(record, 'RelayRecordSourceProxy#create(): Expected the created record to exist.');
	    return record;
	  };

	  RelayRecordSourceProxy.prototype['delete'] = function _delete(dataID) {
	    __webpack_require__(1)(dataID !== ROOT_ID, 'RelayRecordSourceProxy#delete(): Cannot delete the root record.');
	    delete this._proxies[dataID];
	    this._mutator['delete'](dataID);
	  };

	  RelayRecordSourceProxy.prototype.get = function get(dataID) {
	    if (!this._proxies.hasOwnProperty(dataID)) {
	      var status = this._mutator.getStatus(dataID);
	      if (status === EXISTENT) {
	        this._proxies[dataID] = new (__webpack_require__(103))(this, this._mutator, dataID);
	      } else {
	        this._proxies[dataID] = status === NONEXISTENT ? null : undefined;
	      }
	    }
	    return this._proxies[dataID];
	  };

	  RelayRecordSourceProxy.prototype.getRoot = function getRoot() {
	    var root = this.get(ROOT_ID);
	    if (!root) {
	      root = this.create(ROOT_ID, ROOT_TYPE);
	    }
	    __webpack_require__(1)(root && root.getType() === ROOT_TYPE, 'RelayRecordSourceProxy#getRoot(): Expected the source to contain a ' + 'root record.');
	    return root;
	  };

	  return RelayRecordSourceProxy;
	}();

	module.exports = RelayRecordSourceProxy;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule deepFreeze
	 */

	'use strict';

	/**
	 * Recursively "deep" freezes the supplied object.
	 *
	 * For convenience, and for consistency with the behavior of `Object.freeze`,
	 * returns the now-frozen original object.
	 */

	var _isFrozen2 = _interopRequireDefault(__webpack_require__(121));

	var _getOwnPropertyNames2 = _interopRequireDefault(__webpack_require__(120));

	var _freeze2 = _interopRequireDefault(__webpack_require__(76));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function deepFreeze(object) {
	  (0, _freeze2['default'])(object);
	  (0, _getOwnPropertyNames2['default'])(object).forEach(function (name) {
	    var property = object[name];
	    if (property && typeof property === 'object' && !(0, _isFrozen2['default'])(property)) {
	      deepFreeze(property);
	    }
	  });
	  return object;
	}

	module.exports = deepFreeze;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule getRelayStaticHandleKey
	 */

	'use strict';

	var _require = __webpack_require__(97),
	    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

	/**
	 * @internal
	 *
	 * Helper to create a unique name for a handle field based on the handle name, handle key and
	 * source field.
	 */


	function getRelayStaticHandleKey(handleName, key, fieldName) {
	  if (key && key !== DEFAULT_HANDLE_KEY) {
	    return '__' + key + '_' + handleName;
	  }

	  __webpack_require__(1)(fieldName != null, 'getRelayHandleKey: Expected either `fieldName` or `key` in `handle` to be provided');
	  return '__' + fieldName + '_' + handleName;
	}

	module.exports = getRelayStaticHandleKey;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule normalizeRelayPayload
	 * 
	 */

	'use strict';

	var _require = __webpack_require__(4),
	    ROOT_ID = _require.ROOT_ID,
	    ROOT_TYPE = _require.ROOT_TYPE;

	function normalizeRelayPayload(selector, payload, errors) {
	  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { handleStrippedNulls: false };

	  var source = new (__webpack_require__(24))();
	  source.set(ROOT_ID, __webpack_require__(2).create(ROOT_ID, ROOT_TYPE));
	  var fieldPayloads = __webpack_require__(106).normalize(source, selector, payload, options);
	  return {
	    errors: errors,
	    fieldPayloads: fieldPayloads,
	    source: source
	  };
	}

	module.exports = normalizeRelayPayload;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(130), __esModule: true };

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(138), __esModule: true };

/***/ },
/* 49 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(29)
	  , call        = __webpack_require__(151)
	  , isArrayIter = __webpack_require__(150)
	  , anObject    = __webpack_require__(19)
	  , toLength    = __webpack_require__(59)
	  , getIterFn   = __webpack_require__(161)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(49);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(54)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(92)
	  , hide           = __webpack_require__(17)
	  , has            = __webpack_require__(21)
	  , Iterators      = __webpack_require__(30)
	  , $iterCreate    = __webpack_require__(152)
	  , setToStringTag = __webpack_require__(38)
	  , getPrototypeOf = __webpack_require__(156)
	  , ITERATOR       = __webpack_require__(7)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 55 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(57)('keys')
	  , uid    = __webpack_require__(40);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(11)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(58)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(15);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(11)
	  , core           = __webpack_require__(5)
	  , LIBRARY        = __webpack_require__(54)
	  , wksExt         = __webpack_require__(62)
	  , defineProperty = __webpack_require__(12).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(7);

/***/ },
/* 63 */
/***/ function(module, exports) {

	

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(159)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(53)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(162);
	var global        = __webpack_require__(11)
	  , hide          = __webpack_require__(17)
	  , Iterators     = __webpack_require__(30)
	  , TO_STRING_TAG = __webpack_require__(7)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 66 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	var aStackPool = [];
	var bStackPool = [];

	/**
	 * Checks if two values are equal. Values may be primitives, arrays, or objects.
	 * Returns true if both arguments have the same keys and values.
	 *
	 * @see http://underscorejs.org
	 * @copyright 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
	 * @license MIT
	 */
	function areEqual(a, b) {
	  var aStack = aStackPool.length ? aStackPool.pop() : [];
	  var bStack = bStackPool.length ? bStackPool.pop() : [];
	  var result = eq(a, b, aStack, bStack);
	  aStack.length = 0;
	  bStack.length = 0;
	  aStackPool.push(aStack);
	  bStackPool.push(bStack);
	  return result;
	}

	function eq(a, b, aStack, bStack) {
	  if (a === b) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    return a !== 0 || 1 / a == 1 / b;
	  }
	  if (a == null || b == null) {
	    // a or b can be `null` or `undefined`
	    return false;
	  }
	  if (typeof a != 'object' || typeof b != 'object') {
	    return false;
	  }
	  var objToStr = Object.prototype.toString;
	  var className = objToStr.call(a);
	  if (className != objToStr.call(b)) {
	    return false;
	  }
	  switch (className) {
	    case '[object String]':
	      return a == String(b);
	    case '[object Number]':
	      return isNaN(a) || isNaN(b) ? false : a == Number(b);
	    case '[object Date]':
	    case '[object Boolean]':
	      return +a == +b;
	    case '[object RegExp]':
	      return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
	  }
	  // Assume equality for cyclic structures.
	  var length = aStack.length;
	  while (length--) {
	    if (aStack[length] == a) {
	      return bStack[length] == b;
	    }
	  }
	  aStack.push(a);
	  bStack.push(b);
	  var size = 0;
	  // Recursively compare objects and arrays.
	  if (className === '[object Array]') {
	    size = a.length;
	    if (size !== b.length) {
	      return false;
	    }
	    // Deep compare the contents, ignoring non-numeric properties.
	    while (size--) {
	      if (!eq(a[size], b[size], aStack, bStack)) {
	        return false;
	      }
	    }
	  } else {
	    if (a.constructor !== b.constructor) {
	      return false;
	    }
	    if (a.hasOwnProperty('valueOf') && b.hasOwnProperty('valueOf')) {
	      return a.valueOf() == b.valueOf();
	    }
	    var keys = Object.keys(a);
	    if (keys.length != Object.keys(b).length) {
	      return false;
	    }
	    for (var i = 0; i < keys.length; i++) {
	      if (!eq(a[keys[i]], b[keys[i]], aStack, bStack)) {
	        return false;
	      }
	    }
	  }
	  aStack.pop();
	  bStack.pop();
	  return true;
	}

	module.exports = areEqual;

/***/ },
/* 67 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * 
	 */

	/**
	 * Removes an element from an array.
	 */
	function removeFromArray(array, element) {
	  var index = array.indexOf(element);
	  if (index !== -1) {
	    array.splice(index, 1);
	  }
	}

	module.exports = removeFromArray;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule RelayConcreteVariables
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(28));

	var _stringify2 = _interopRequireDefault(__webpack_require__(18));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * Determines the variables that are in scope for a fragment given the variables
	 * in scope at the root query as well as any arguments applied at the fragment
	 * spread via `@arguments`.
	 *
	 * Note that this is analagous to determining function arguments given a function call.
	 */
	function getFragmentVariables(fragment, rootVariables, argumentVariables) {
	  var variables = void 0;
	  fragment.argumentDefinitions.forEach(function (definition) {
	    if (argumentVariables.hasOwnProperty(definition.name)) {
	      return;
	    }
	    variables = variables || (0, _extends3['default'])({}, argumentVariables);
	    switch (definition.kind) {
	      case 'LocalArgument':
	        variables[definition.name] = definition.defaultValue;
	        break;
	      case 'RootArgument':
	        __webpack_require__(1)(rootVariables.hasOwnProperty(definition.name), 'RelayConcreteVariables: Expected a defined query variable for `$%s` ' + 'in fragment `%s`.', definition.name, fragment.name);
	        variables[definition.name] = rootVariables[definition.name];
	        break;
	      default:
	        __webpack_require__(1)(false, 'RelayConcreteVariables: Unexpected node kind `%s` in fragment `%s`.', definition.kind, fragment.name);
	    }
	  });
	  return variables || argumentVariables;
	}

	/**
	 * Determines the variables that are in scope for a given operation given values
	 * for some/all of its arguments. Extraneous input variables are filtered from
	 * the output, and missing variables are set to default values (if given in the
	 * operation's definition).
	 */
	function getOperationVariables(operation, variables) {
	  var operationVariables = {};
	  operation.query.argumentDefinitions.forEach(function (def) {
	    var value = def.defaultValue;
	    if (variables[def.name] != null) {
	      value = variables[def.name];
	    }
	    operationVariables[def.name] = value;
	    if (true) {
	      __webpack_require__(23)(value != null || !def.type.endsWith('!'), 'RelayConcreteVariables: Expected a value for non-nullable variable ' + '`$%s: %s` on operation `%s`, got `%s`. Make sure you supply a ' + 'value for all non-nullable arguments.', def.name, def.type, operation.name, (0, _stringify2['default'])(value));
	    }
	  });
	  return operationVariables;
	}

	module.exports = {
	  getFragmentVariables: getFragmentVariables,
	  getOperationVariables: getOperationVariables
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayProfiler
	 * 
	 */

	'use strict';

	var aggregateHandlersByName = {
	  '*': []
	};
	var profileHandlersByName = {
	  '*': []
	};

	var NOT_INVOKED = {};
	var defaultProfiler = { stop: __webpack_require__(41) };
	var shouldInstrument = function shouldInstrument(name) {
	  if (true) {
	    return true;
	  }
	  return name.charAt(0) !== '@';
	};

	/**
	 * @public
	 *
	 * Instruments methods to allow profiling various parts of Relay. Profiling code
	 * in Relay consists of three steps:
	 *
	 *  - Instrument the function to be profiled.
	 *  - Attach handlers to the instrumented function.
	 *  - Run the code which triggers the handlers.
	 *
	 * Handlers attached to instrumented methods are called with an instrumentation
	 * name and a callback that must be synchronously executed:
	 *
	 *   instrumentedMethod.attachHandler(function(name, callback) {
	 *     const start = performance.now();
	 *     callback();
	 *     console.log('Duration', performance.now() - start);
	 *   });
	 *
	 * Handlers for profiles are callbacks that return a stop method:
	 *
	 *   RelayProfiler.attachProfileHandler('profileName', (name, state) => {
	 *     const start = performance.now();
	 *     return function stop(name, state) {
	 *       console.log(`Duration (${name})`, performance.now() - start);
	 *     }
	 *   });
	 *
	 * In order to reduce the impact on performance in production, instrumented
	 * methods and profilers with names that begin with `@` will only be measured
	 * if `__DEV__` is true. This should be used for very hot functions.
	 */
	var RelayProfiler = {

	  /**
	   * Instruments methods on a class or object. This re-assigns the method in
	   * order to preserve function names in stack traces (which are detected by
	   * modern debuggers via heuristics). Example usage:
	   *
	   *   const RelayStore = { primeCache: function() {...} };
	   *   RelayProfiler.instrumentMethods(RelayStore, {
	   *     primeCache: 'RelayStore.primeCache'
	   *   });
	   *
	   *   RelayStore.primeCache.attachHandler(...);
	   *
	   * As a result, the methods will be replaced by wrappers that provide the
	   * `attachHandler` and `detachHandler` methods.
	   */
	  instrumentMethods: function instrumentMethods(object, names) {
	    __webpack_require__(13)(names, function (name, key) {
	      object[key] = RelayProfiler.instrument(name, object[key]);
	    });
	  },


	  /**
	   * Wraps the supplied function with one that provides the `attachHandler` and
	   * `detachHandler` methods. Example usage:
	   *
	   *   const printRelayQuery =
	   *     RelayProfiler.instrument('printRelayQuery', printRelayQuery);
	   *
	   *   printRelayQuery.attachHandler(...);
	   *
	   * NOTE: The instrumentation assumes that no handlers are attached or detached
	   * in the course of executing another handler.
	   */
	  instrument: function instrument(name, originalFunction) {
	    if (!shouldInstrument(name)) {
	      originalFunction.attachHandler = __webpack_require__(41);
	      originalFunction.detachHandler = __webpack_require__(41);
	      return originalFunction;
	    }
	    if (!aggregateHandlersByName.hasOwnProperty(name)) {
	      aggregateHandlersByName[name] = [];
	    }
	    var catchallHandlers = aggregateHandlersByName['*'];
	    var aggregateHandlers = aggregateHandlersByName[name];
	    var handlers = [];
	    var contexts = [];
	    var invokeHandlers = function invokeHandlers() {
	      var context = contexts[contexts.length - 1];
	      if (context[0]) {
	        context[0]--;
	        catchallHandlers[context[0]](name, invokeHandlers);
	      } else if (context[1]) {
	        context[1]--;
	        aggregateHandlers[context[1]](name, invokeHandlers);
	      } else if (context[2]) {
	        context[2]--;
	        handlers[context[2]](name, invokeHandlers);
	      } else {
	        context[5] = originalFunction.apply(context[3], context[4]);
	      }
	    };
	    var instrumentedCallback = function instrumentedCallback() {
	      var returnValue = void 0;
	      if (aggregateHandlers.length === 0 && handlers.length === 0 && catchallHandlers.length === 0) {
	        returnValue = originalFunction.apply(this, arguments);
	      } else {
	        contexts.push([catchallHandlers.length, aggregateHandlers.length, handlers.length, this, arguments, NOT_INVOKED]);
	        invokeHandlers();
	        var context = contexts.pop();
	        returnValue = context[5];
	        if (returnValue === NOT_INVOKED) {
	          throw new Error('RelayProfiler: Handler did not invoke original function.');
	        }
	      }
	      return returnValue;
	    };
	    instrumentedCallback.attachHandler = function (handler) {
	      handlers.push(handler);
	    };
	    instrumentedCallback.detachHandler = function (handler) {
	      __webpack_require__(67)(handlers, handler);
	    };
	    instrumentedCallback.displayName = '(instrumented ' + name + ')';
	    return instrumentedCallback;
	  },


	  /**
	   * Attaches a handler to all methods instrumented with the supplied name.
	   *
	   *   function createRenderer() {
	   *     return RelayProfiler.instrument('render', function() {...});
	   *   }
	   *   const renderA = createRenderer();
	   *   const renderB = createRenderer();
	   *
	   *   // Only profiles `renderA`.
	   *   renderA.attachHandler(...);
	   *
	   *   // Profiles both `renderA` and `renderB`.
	   *   RelayProfiler.attachAggregateHandler('render', ...);
	   *
	   */
	  attachAggregateHandler: function attachAggregateHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (!aggregateHandlersByName.hasOwnProperty(name)) {
	        aggregateHandlersByName[name] = [];
	      }
	      aggregateHandlersByName[name].push(handler);
	    }
	  },


	  /**
	   * Detaches a handler attached via `attachAggregateHandler`.
	   */
	  detachAggregateHandler: function detachAggregateHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (aggregateHandlersByName.hasOwnProperty(name)) {
	        __webpack_require__(67)(aggregateHandlersByName[name], handler);
	      }
	    }
	  },


	  /**
	   * Instruments profiling for arbitrarily asynchronous code by a name.
	   *
	   *   const timerProfiler = RelayProfiler.profile('timeout');
	   *   setTimeout(function() {
	   *     timerProfiler.stop();
	   *   }, 1000);
	   *
	   *   RelayProfiler.attachProfileHandler('timeout', ...);
	   *
	   * Arbitrary state can also be passed into `profile` as a second argument. The
	   * attached profile handlers will receive this as the second argument.
	   */
	  profile: function profile(name, state) {
	    var hasCatchAllHandlers = profileHandlersByName['*'].length > 0;
	    var hasNamedHandlers = profileHandlersByName.hasOwnProperty(name);
	    if (hasNamedHandlers || hasCatchAllHandlers) {
	      var profileHandlers = hasNamedHandlers && hasCatchAllHandlers ? profileHandlersByName[name].concat(profileHandlersByName['*']) : hasNamedHandlers ? profileHandlersByName[name] : profileHandlersByName['*'];
	      var stopHandlers = void 0;
	      for (var ii = profileHandlers.length - 1; ii >= 0; ii--) {
	        var profileHandler = profileHandlers[ii];
	        var stopHandler = profileHandler(name, state);
	        stopHandlers = stopHandlers || [];
	        stopHandlers.unshift(stopHandler);
	      }
	      return {
	        stop: function stop() {
	          if (stopHandlers) {
	            stopHandlers.forEach(function (stopHandler) {
	              return stopHandler();
	            });
	          }
	        }
	      };
	    }
	    return defaultProfiler;
	  },


	  /**
	   * Attaches a handler to profiles with the supplied name. You can also
	   * attach to the special name '*' which is a catch all.
	   */
	  attachProfileHandler: function attachProfileHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (!profileHandlersByName.hasOwnProperty(name)) {
	        profileHandlersByName[name] = [];
	      }
	      profileHandlersByName[name].push(handler);
	    }
	  },


	  /**
	   * Detaches a handler attached via `attachProfileHandler`.
	   */
	  detachProfileHandler: function detachProfileHandler(name, handler) {
	    if (shouldInstrument(name)) {
	      if (profileHandlersByName.hasOwnProperty(name)) {
	        __webpack_require__(67)(profileHandlersByName[name], handler);
	      }
	    }
	  }
	};

	module.exports = RelayProfiler;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayReader
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var CONDITION = __webpack_require__(3).CONDITION,
	    FRAGMENT_SPREAD = __webpack_require__(3).FRAGMENT_SPREAD,
	    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
	    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
	    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD;

	var FRAGMENTS_KEY = __webpack_require__(4).FRAGMENTS_KEY,
	    ID_KEY = __webpack_require__(4).ID_KEY,
	    getArgumentValues = __webpack_require__(4).getArgumentValues,
	    getStorageKey = __webpack_require__(4).getStorageKey;

	function read(recordSource, selector) {
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  var reader = new RelayReader(recordSource, variables);
	  return reader.read(node, dataID);
	}

	/**
	 * @private
	 */

	var RelayReader = function () {
	  function RelayReader(recordSource, variables) {
	    (0, _classCallCheck3['default'])(this, RelayReader);

	    this._recordSource = recordSource;
	    this._seenRecords = {};
	    this._variables = variables;
	  }

	  RelayReader.prototype.read = function read(node, dataID) {
	    var data = this._traverse(node, dataID, null);
	    return {
	      data: data,
	      dataID: dataID,
	      node: node,
	      seenRecords: this._seenRecords,
	      variables: this._variables
	    };
	  };

	  RelayReader.prototype._traverse = function _traverse(node, dataID, prevData) {
	    var record = this._recordSource.get(dataID);
	    this._seenRecords[dataID] = record;
	    if (record == null) {
	      return record;
	    }
	    var data = prevData || {};
	    this._traverseSelections(node.selections, record, data);
	    return data;
	  };

	  RelayReader.prototype._getVariableValue = function _getVariableValue(name) {
	    __webpack_require__(1)(this._variables.hasOwnProperty(name), 'RelayReader(): Undefined variable `%s`.', name);
	    return this._variables[name];
	  };

	  RelayReader.prototype._traverseSelections = function _traverseSelections(selections, record, data) {
	    var _this = this;

	    selections.forEach(function (selection) {
	      if (selection.kind === SCALAR_FIELD) {
	        _this._readScalar(selection, record, data);
	      } else if (selection.kind === LINKED_FIELD) {
	        if (selection.plural) {
	          _this._readPluralLink(selection, record, data);
	        } else {
	          _this._readLink(selection, record, data);
	        }
	      } else if (selection.kind === CONDITION) {
	        var conditionValue = _this._getVariableValue(selection.condition);
	        if (conditionValue === selection.passingValue) {
	          _this._traverseSelections(selection.selections, record, data);
	        }
	      } else if (selection.kind === INLINE_FRAGMENT) {
	        var typeName = __webpack_require__(2).getType(record);
	        if (typeName != null && typeName === selection.type) {
	          _this._traverseSelections(selection.selections, record, data);
	        }
	      } else if (selection.kind === FRAGMENT_SPREAD) {
	        _this._createFragmentPointer(selection, record, data);
	      } else {
	        __webpack_require__(1)(false, 'RelayReader(): Unexpected ast kind `%s`.', selection.kind);
	      }
	    });
	  };

	  RelayReader.prototype._readScalar = function _readScalar(field, record, data) {
	    var applicationName = field.alias || field.name;
	    var storageKey = getStorageKey(field, this._variables);
	    var value = __webpack_require__(2).getValue(record, storageKey);
	    data[applicationName] = value;
	  };

	  RelayReader.prototype._readLink = function _readLink(field, record, data) {
	    var applicationName = field.alias || field.name;
	    var storageKey = getStorageKey(field, this._variables);
	    var linkedID = __webpack_require__(2).getLinkedRecordID(record, storageKey);

	    if (linkedID == null) {
	      data[applicationName] = linkedID;
	      return;
	    }

	    var prevData = data[applicationName];
	    __webpack_require__(1)(prevData == null || typeof prevData === 'object', 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, __webpack_require__(2).getDataID(record), prevData);
	    data[applicationName] = this._traverse(field, linkedID, prevData);
	  };

	  RelayReader.prototype._readPluralLink = function _readPluralLink(field, record, data) {
	    var _this2 = this;

	    var applicationName = field.alias || field.name;
	    var storageKey = getStorageKey(field, this._variables);
	    var linkedIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);

	    if (linkedIDs == null) {
	      data[applicationName] = linkedIDs;
	      return;
	    }

	    var prevData = data[applicationName];
	    __webpack_require__(1)(prevData == null || Array.isArray(prevData), 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an array, got `%s`.', applicationName, __webpack_require__(2).getDataID(record), prevData);
	    var linkedArray = prevData || [];
	    linkedIDs.forEach(function (linkedID, nextIndex) {
	      if (linkedID == null) {
	        linkedArray[nextIndex] = linkedID;
	        return;
	      }
	      var prevItem = linkedArray[nextIndex];
	      __webpack_require__(1)(prevItem == null || typeof prevItem === 'object', 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, __webpack_require__(2).getDataID(record), prevItem);
	      var linkedItem = _this2._traverse(field, linkedID, prevItem);
	      linkedArray[nextIndex] = linkedItem;
	    });
	    data[applicationName] = linkedArray;
	  };

	  RelayReader.prototype._createFragmentPointer = function _createFragmentPointer(fragmentSpread, record, data) {
	    var fragmentPointers = data[FRAGMENTS_KEY];
	    if (!fragmentPointers) {
	      fragmentPointers = data[FRAGMENTS_KEY] = {};
	    }
	    __webpack_require__(1)(typeof fragmentPointers === 'object' && fragmentPointers, 'RelayReader: Expected fragment spread data to be an object, got `%s`.', fragmentPointers);
	    data[ID_KEY] = data[ID_KEY] || __webpack_require__(2).getDataID(record);
	    var variables = fragmentSpread.args ? getArgumentValues(fragmentSpread.args, this._variables) : {};
	    fragmentPointers[fragmentSpread.name] = variables;
	  };

	  return RelayReader;
	}();

	module.exports = { read: read };

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStaticEnvironment
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var RelayStaticEnvironment = function () {
	  function RelayStaticEnvironment(config) {
	    (0, _classCallCheck3['default'])(this, RelayStaticEnvironment);

	    this._network = config.network;
	    this._publishQueue = new (__webpack_require__(102))(config.store, config.handlerProvider);
	    this._store = config.store;
	    this.unstable_internal = __webpack_require__(14);
	  }

	  RelayStaticEnvironment.prototype.getStore = function getStore() {
	    return this._store;
	  };

	  RelayStaticEnvironment.prototype.applyUpdate = function applyUpdate(updater) {
	    var _this = this;

	    var dispose = function dispose() {
	      _this._publishQueue.revertUpdate(updater);
	      _this._publishQueue.run();
	    };
	    this._publishQueue.applyUpdate(updater);
	    this._publishQueue.run();
	    return { dispose: dispose };
	  };

	  RelayStaticEnvironment.prototype.commitPayload = function commitPayload(selector, payload) {
	    // Do not handle stripped nulls when commiting a payload
	    var relayPayload = __webpack_require__(46)(selector, payload);
	    this._publishQueue.commitPayload(selector, relayPayload);
	    this._publishQueue.run();
	  };

	  RelayStaticEnvironment.prototype.commitUpdate = function commitUpdate(updater) {
	    this._publishQueue.commitUpdate(updater);
	    this._publishQueue.run();
	  };

	  RelayStaticEnvironment.prototype.lookup = function lookup(selector) {
	    return this._store.lookup(selector);
	  };

	  RelayStaticEnvironment.prototype.subscribe = function subscribe(snapshot, callback) {
	    return this._store.subscribe(snapshot, callback);
	  };

	  RelayStaticEnvironment.prototype.retain = function retain(selector) {
	    return this._store.retain(selector);
	  };

	  RelayStaticEnvironment.prototype.sendQuery = function sendQuery(_ref) {
	    var _this2 = this;

	    var cacheConfig = _ref.cacheConfig,
	        onCompleted = _ref.onCompleted,
	        onError = _ref.onError,
	        onNext = _ref.onNext,
	        operation = _ref.operation;

	    var isDisposed = false;
	    var dispose = function dispose() {
	      isDisposed = true;
	    };
	    this._network.request(operation.node, operation.variables, cacheConfig).then(function (payload) {
	      if (isDisposed) {
	        return;
	      }
	      _this2._publishQueue.commitPayload(operation.fragment, payload);
	      _this2._publishQueue.run();
	      onNext && onNext(payload);
	      onCompleted && onCompleted();
	    })['catch'](function (error) {
	      if (isDisposed) {
	        return;
	      }
	      onError && onError(error);
	    });
	    return { dispose: dispose };
	  };

	  RelayStaticEnvironment.prototype.streamQuery = function streamQuery(_ref2) {
	    var _this3 = this;

	    var cacheConfig = _ref2.cacheConfig,
	        onCompleted = _ref2.onCompleted,
	        onError = _ref2.onError,
	        _onNext = _ref2.onNext,
	        operation = _ref2.operation;

	    return this._network.requestStream(operation.node, operation.variables, cacheConfig, {
	      onCompleted: onCompleted,
	      onError: onError,
	      onNext: function onNext(payload) {
	        _this3._publishQueue.commitPayload(operation.fragment, payload);
	        _this3._publishQueue.run();
	        _onNext && _onNext(payload);
	      }
	    });
	  };

	  RelayStaticEnvironment.prototype.sendMutation = function sendMutation(_ref3) {
	    var _this4 = this;

	    var onCompleted = _ref3.onCompleted,
	        onError = _ref3.onError,
	        operation = _ref3.operation,
	        optimisticUpdater = _ref3.optimisticUpdater,
	        updater = _ref3.updater,
	        uploadables = _ref3.uploadables;

	    if (optimisticUpdater) {
	      this._publishQueue.applyUpdate(optimisticUpdater);
	      this._publishQueue.run();
	    }
	    var isDisposed = false;
	    var dispose = function dispose() {
	      if (optimisticUpdater) {
	        _this4._publishQueue.revertUpdate(optimisticUpdater);
	        _this4._publishQueue.run();
	        optimisticUpdater = null;
	      }
	      isDisposed = true;
	    };
	    this._network.request(operation.node, operation.variables, { force: true }, uploadables).then(function (payload) {
	      if (isDisposed) {
	        return;
	      }
	      if (optimisticUpdater) {
	        _this4._publishQueue.revertUpdate(optimisticUpdater);
	      }
	      _this4._publishQueue.commitPayload(operation.fragment, payload, updater);
	      _this4._publishQueue.run();
	      onCompleted && onCompleted(payload.errors);
	    })['catch'](function (error) {
	      if (isDisposed) {
	        return;
	      }
	      if (optimisticUpdater) {
	        _this4._publishQueue.revertUpdate(optimisticUpdater);
	      }
	      _this4._publishQueue.run();
	      onError && onError(error);
	    });
	    return { dispose: dispose };
	  };

	  RelayStaticEnvironment.prototype.sendSubscription = function sendSubscription(_ref4) {
	    var _this5 = this;

	    var onCompleted = _ref4.onCompleted,
	        _onNext2 = _ref4.onNext,
	        onError = _ref4.onError,
	        operation = _ref4.operation,
	        updater = _ref4.updater;

	    return this._network.requestStream(operation.node, operation.variables, { force: true }, {
	      onCompleted: onCompleted,
	      onError: onError,
	      onNext: function onNext(payload) {
	        _this5._publishQueue.commitPayload(operation.fragment, payload, updater);
	        _this5._publishQueue.run();
	        _onNext2 && _onNext2(payload);
	      }
	    });
	  };

	  return RelayStaticEnvironment;
	}();

	module.exports = RelayStaticEnvironment;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStaticSelector
	 * 
	 */

	'use strict';

	var _assign2 = _interopRequireDefault(__webpack_require__(47));

	var _stringify2 = _interopRequireDefault(__webpack_require__(18));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(68),
	    getFragmentVariables = _require.getFragmentVariables;

	var _require2 = __webpack_require__(4),
	    FRAGMENTS_KEY = _require2.FRAGMENTS_KEY,
	    ID_KEY = _require2.ID_KEY;

	/**
	 * @public
	 *
	 * Given the result `item` from a parent that fetched `fragment`, creates a
	 * selector that can be used to read the results of that fragment for that item.
	 *
	 * Example:
	 *
	 * Given two fragments as follows:
	 *
	 * ```
	 * fragment Parent on User {
	 *   id
	 *   ...Child
	 * }
	 * fragment Child on User {
	 *   name
	 * }
	 * ```
	 *
	 * And given some object `parent` that is the results of `Parent` for id "4",
	 * the results of `Child` can be accessed by first getting a selector and then
	 * using that selector to `lookup()` the results against the environment:
	 *
	 * ```
	 * const childSelector = getSelector(queryVariables, Child, parent);
	 * const childData = environment.lookup(childSelector).data;
	 * ```
	 */
	function getSelector(operationVariables, fragment, item) {
	  __webpack_require__(1)(typeof item === 'object' && item !== null && !Array.isArray(item), 'RelayStaticSelector: Expected value for fragment `%s` to be an object, got ' + '`%s`.', fragment.name, (0, _stringify2['default'])(item));
	  var dataID = item[ID_KEY];
	  var fragments = item[FRAGMENTS_KEY];
	  if (typeof dataID === 'string' && typeof fragments === 'object' && fragments !== null && typeof fragments[fragment.name] === 'object' && fragments[fragment.name] !== null) {
	    var argumentVariables = fragments[fragment.name];
	    var fragmentVariables = getFragmentVariables(fragment, operationVariables, argumentVariables);
	    return {
	      dataID: dataID,
	      node: fragment,
	      variables: fragmentVariables
	    };
	  }
	  __webpack_require__(23)(false, 'RelayStaticSelector: Expected object to contain data for fragment `%s`, got ' + '`%s`. Make sure that the parent operation/fragment included fragment ' + '`...%s`.', fragment.name, (0, _stringify2['default'])(item), fragment.name);
	  return null;
	}

	/**
	 * @public
	 *
	 * Given the result `items` from a parent that fetched `fragment`, creates a
	 * selector that can be used to read the results of that fragment on those
	 * items. This is similar to `getSelector` but for "plural" fragments that
	 * expect an array of results and therefore return an array of selectors.
	 */
	function getSelectorList(operationVariables, fragment, items) {
	  var selectors = null;
	  items.forEach(function (item) {
	    var selector = item != null ? getSelector(operationVariables, fragment, item) : null;
	    if (selector != null) {
	      selectors = selectors || [];
	      selectors.push(selector);
	    }
	  });
	  return selectors;
	}

	/**
	 * @public
	 *
	 * Given a mapping of keys -> results and a mapping of keys -> fragments,
	 * extracts the selectors for those fragments from the results.
	 *
	 * The canonical use-case for this function is ReactRelayFragmentContainer, which
	 * uses this function to convert (props, fragments) into selectors so that it
	 * can read the results to pass to the inner component.
	 */
	function getSelectorsFromObject(operationVariables, fragments, object) {
	  var selectors = {};
	  __webpack_require__(13)(fragments, function (fragment, key) {
	    var item = object[key];
	    if (item == null) {
	      selectors[key] = item;
	    } else if (fragment.metadata && fragment.metadata.plural === true) {
	      __webpack_require__(1)(Array.isArray(item), 'RelayStaticSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', key, (0, _stringify2['default'])(item), fragment.name);
	      selectors[key] = getSelectorList(operationVariables, fragment, item);
	    } else {
	      __webpack_require__(1)(!Array.isArray(item), 'RelayStaticFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', key, (0, _stringify2['default'])(item), fragment.name);
	      selectors[key] = getSelector(operationVariables, fragment, item);
	    }
	  });
	  return selectors;
	}

	/**
	 * @public
	 *
	 * Given a mapping of keys -> results and a mapping of keys -> fragments,
	 * extracts a mapping of keys -> id(s) of the results.
	 *
	 * Similar to `getSelectorsFromObject()`, this function can be useful in
	 * determining the "identity" of the props passed to a component.
	 */
	function getDataIDsFromObject(fragments, object) {
	  var ids = {};
	  __webpack_require__(13)(fragments, function (fragment, key) {
	    var item = object[key];
	    if (item == null) {
	      ids[key] = item;
	    } else if (fragment.metadata && fragment.metadata.plural === true) {
	      __webpack_require__(1)(Array.isArray(item), 'RelayStaticSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', key, (0, _stringify2['default'])(item), fragment.name);
	      ids[key] = getDataIDs(fragment, item);
	    } else {
	      __webpack_require__(1)(!Array.isArray(item), 'RelayStaticFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', key, (0, _stringify2['default'])(item), fragment.name);
	      ids[key] = getDataID(fragment, item);
	    }
	  });
	  return ids;
	}

	/**
	 * @internal
	 */
	function getDataIDs(fragment, items) {
	  var ids = void 0;
	  items.forEach(function (item) {
	    var id = item != null ? getDataID(fragment, item) : null;
	    if (id != null) {
	      ids = ids || [];
	      ids.push(id);
	    }
	  });
	  return ids || null;
	}

	/**
	 * @internal
	 */
	function getDataID(fragment, item) {
	  __webpack_require__(1)(typeof item === 'object' && item !== null && !Array.isArray(item), 'RelayStaticSelector: Expected value for fragment `%s` to be an object, got ' + '`%s`.', fragment.name, (0, _stringify2['default'])(item));
	  var dataID = item[ID_KEY];
	  if (typeof dataID === 'string') {
	    return dataID;
	  }
	  __webpack_require__(23)(false, 'RelayStaticSelector: Expected object to contain data for fragment `%s`, got ' + '`%s`. Make sure that the parent operation/fragment included fragment ' + '`...%s`.', fragment.name, (0, _stringify2['default'])(item), fragment.name);
	  return null;
	}

	/**
	 * @public
	 *
	 * Given a mapping of keys -> results and a mapping of keys -> fragments,
	 * extracts the merged variables that would be in scope for those
	 * fragments/results.
	 *
	 * This can be useful in determing what varaibles were used to fetch the data
	 * for a Relay container, for example.
	 */
	function getVariablesFromObject(operationVariables, fragments, object) {
	  var variables = {};
	  __webpack_require__(13)(fragments, function (fragment, key) {
	    var item = object[key];
	    if (item == null) {
	      return;
	    } else if (fragment.metadata && fragment.metadata.plural === true) {
	      __webpack_require__(1)(Array.isArray(item), 'RelayStaticSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', key, (0, _stringify2['default'])(item), fragment.name);
	      item.forEach(function (value) {
	        if (value != null) {
	          var itemVariables = getVariables(operationVariables, fragment, value);
	          if (itemVariables) {
	            (0, _assign2['default'])(variables, itemVariables);
	          }
	        }
	      });
	    } else {
	      __webpack_require__(1)(!Array.isArray(item), 'RelayStaticFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', key, (0, _stringify2['default'])(item), fragment.name);
	      var itemVariables = getVariables(operationVariables, fragment, item);
	      if (itemVariables) {
	        (0, _assign2['default'])(variables, itemVariables);
	      }
	    }
	  });
	  return variables;
	}

	/**
	 * @internal
	 */
	function getVariables(operationVariables, fragment, item) {
	  var selector = getSelector(operationVariables, fragment, item);
	  return selector ? selector.variables : null;
	}

	/**
	 * @public
	 *
	 * Determine if two selectors are equal (represent the same selection). Note
	 * that this function returns `false` when the two queries/fragments are
	 * different objects, even if they select the same fields.
	 */
	function areEqualSelectors(thisSelector, thatSelector) {
	  return thisSelector.dataID === thatSelector.dataID && thisSelector.node === thatSelector.node && __webpack_require__(66)(thisSelector.variables, thatSelector.variables);
	}

	module.exports = {
	  areEqualSelectors: areEqualSelectors,
	  getDataIDsFromObject: getDataIDsFromObject,
	  getSelector: getSelector,
	  getSelectorList: getSelectorList,
	  getSelectorsFromObject: getSelectorsFromObject,
	  getVariablesFromObject: getVariablesFromObject
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule cloneRelayHandleSourceField
	 * 
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(28));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    getHandleFilterValues = _require.getHandleFilterValues;

	var LINKED_FIELD = __webpack_require__(3).LINKED_FIELD;

	/**
	 * @private
	 *
	 * Creates a clone of the supplied `handleField` by finding the original linked
	 * field (on which the handle was declared) among the sibling `selections`, and
	 * copying its selections into the clone.
	 */


	function cloneRelayHandleSourceField(handleField, selections, variables) {
	  var sourceField = selections.find(function (source) {
	    return source.kind === LINKED_FIELD && source.name === handleField.name && source.alias === handleField.alias && __webpack_require__(66)(source.args, handleField.args);
	  });
	  __webpack_require__(1)(sourceField && sourceField.kind === LINKED_FIELD, 'cloneRelayHandleSourceField: Expected a corresponding source field for ' + 'handle `%s`.', handleField.handle);
	  var handleKey = __webpack_require__(45)(handleField.handle, handleField.key, handleField.name);
	  if (handleField.filters && handleField.filters.length > 0) {
	    var filterValues = getHandleFilterValues(handleField.args || [], handleField.filters, variables);
	    handleKey = __webpack_require__(8)(handleKey, filterValues);
	  }

	  var clonedField = (0, _extends3['default'])({}, sourceField, {
	    args: null,
	    name: handleKey,
	    storageKey: handleKey
	  });
	  return clonedField;
	}

	module.exports = cloneRelayHandleSourceField;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule isRelayStaticEnvironment
	 * 
	 */

	'use strict';

	/**
	 * Determine if a given value is an object that implements the `Environment`
	 * interface defined in `RelayStoreTypes`.
	 *
	 * Currently the only true implementation is `RelayStaticEnvironment`, so to avoid
	 * possible confusion with `RelayEnvironment` during the transition period this
	 * function uses an instanceof check.
	 */
	function isRelayStaticEnvironment(environment) {
	  return environment instanceof __webpack_require__(71);
	}

	module.exports = isRelayStaticEnvironment;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule stableJSONStringify
	 */

	'use strict';

	/**
	 * Simple recursive stringifier that produces a stable JSON string suitable for
	 * use as a cache key. Does not handle corner-cases such as circular references
	 * or exotic types.
	 */

	var _stringify2 = _interopRequireDefault(__webpack_require__(18));

	var _keys2 = _interopRequireDefault(__webpack_require__(27));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function stableJSONStringify(obj) {
	  if (Array.isArray(obj)) {
	    var result = [];
	    for (var ii = 0; ii < obj.length; ii++) {
	      var value = obj[ii] !== undefined ? obj[ii] : null;
	      result.push(stableJSONStringify(value));
	    }
	    return '[' + result.join(',') + ']';
	  } else if (typeof obj === 'object' && obj) {
	    var _result = [];
	    var keys = (0, _keys2['default'])(obj);
	    keys.sort();
	    for (var _ii = 0; _ii < keys.length; _ii++) {
	      var key = keys[_ii];
	      var _value = stableJSONStringify(obj[key]);
	      _result.push('"' + key + '":' + _value);
	    }
	    return '{' + _result.join(',') + '}';
	  } else {
	    return (0, _stringify2['default'])(obj);
	  }
	}

	module.exports = stableJSONStringify;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(133), __esModule: true };

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(124);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(123);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(49)
	  , TAG = __webpack_require__(7)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var dP          = __webpack_require__(12).f
	  , create      = __webpack_require__(34)
	  , redefineAll = __webpack_require__(91)
	  , ctx         = __webpack_require__(29)
	  , anInstance  = __webpack_require__(78)
	  , defined     = __webpack_require__(32)
	  , forOf       = __webpack_require__(51)
	  , $iterDefine = __webpack_require__(53)
	  , step        = __webpack_require__(86)
	  , setSpecies  = __webpack_require__(158)
	  , DESCRIPTORS = __webpack_require__(9)
	  , fastKey     = __webpack_require__(33).fastKey
	  , SIZE        = DESCRIPTORS ? '_s' : 'size';

	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};

	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      anInstance(that, C, NAME, '_i');
	      that._i = create(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        anInstance(this, C, 'forEach');
	        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(DESCRIPTORS)dP(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = __webpack_require__(79)
	  , from    = __webpack_require__(143);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global         = __webpack_require__(11)
	  , $export        = __webpack_require__(10)
	  , meta           = __webpack_require__(33)
	  , fails          = __webpack_require__(20)
	  , hide           = __webpack_require__(17)
	  , redefineAll    = __webpack_require__(91)
	  , forOf          = __webpack_require__(51)
	  , anInstance     = __webpack_require__(78)
	  , isObject       = __webpack_require__(15)
	  , setToStringTag = __webpack_require__(38)
	  , dP             = __webpack_require__(12).f
	  , each           = __webpack_require__(145)(0)
	  , DESCRIPTORS    = __webpack_require__(9);

	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = global[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
	    new C().entries().next();
	  }))){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	    meta.NEED = true;
	  } else {
	    C = wrapper(function(target, iterable){
	      anInstance(target, C, NAME, '_c');
	      target._c = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
	        anInstance(this, C, KEY);
	        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    if('size' in proto)dP(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }

	  setToStringTag(C, NAME);

	  O[NAME] = C;
	  $export($export.G + $export.W + $export.F, O);

	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(15)
	  , document = __webpack_require__(11).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(9) && !__webpack_require__(20)(function(){
	  return Object.defineProperty(__webpack_require__(83)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(49);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(35)
	  , createDesc     = __webpack_require__(37)
	  , toIObject      = __webpack_require__(22)
	  , toPrimitive    = __webpack_require__(60)
	  , has            = __webpack_require__(21)
	  , IE8_DOM_DEFINE = __webpack_require__(84)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(9) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(22)
	  , gOPN      = __webpack_require__(89).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(90)
	  , hiddenKeys = __webpack_require__(50).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(21)
	  , toIObject    = __webpack_require__(22)
	  , arrayIndexOf = __webpack_require__(144)(false)
	  , IE_PROTO     = __webpack_require__(56)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(17);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(17);

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 */

	module.exports = __webpack_require__(180);

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayAsyncLoader
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var CONDITION = __webpack_require__(3).CONDITION,
	    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
	    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
	    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
	    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD;

	var getStorageKey = __webpack_require__(4).getStorageKey;

	/**
	 * Attempts to synchronously check whether the records required to fulfill the
	 * given `selector` are present in `source` (synchronous checks, for example,
	 * are possible with the `RelayInMemoryRecordSource`).
	 *
	 * If so, returns `true`, and the records will be present in `target`;
	 * otherwise `false`.
	 */


	function check(source, target, selector) {
	  var state = null;
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  function callback(loadingState) {
	    state = loadingState;
	  }
	  var loader = new RelayAsyncLoader(source, target, variables, callback);
	  var disposable = loader.load(node, dataID);
	  disposable.dispose();
	  return !!(state && state.status === 'complete');
	}

	/**
	 * Load the records required to fulfill the given `selector` from `source` and add
	 * them to `target`, calling the provided callback exactly once with an argument
	 * as follows:
	 * - {status: 'aborted'}: If `dispose()` was called on the Disposable returned
	 *   by `load` before loading the required records could be completed.
	 * - {status: 'complete'}: If a cached value/record was found for all fields in
	 *   the selector.
	 * - {status: 'error', error}: If an error occured loading any record from
	 *   source.
	 * - {status: 'missing'}: If any value/record was missing.
	 *
	 * Note that the callback may be called synchronously *or* asynchronously.
	 */
	function load(source, target, selector, callback) {
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  var loader = new RelayAsyncLoader(source, target, variables, callback);
	  return loader.load(node, dataID);
	}

	/**
	 * @private
	 */

	var RelayAsyncLoader = function () {
	  function RelayAsyncLoader(source, target, variables, callback) {
	    (0, _classCallCheck3['default'])(this, RelayAsyncLoader);

	    this._callback = callback;
	    this._done = false;
	    this._loadingCount = 0;
	    this._source = source;
	    this._target = target;
	    this._variables = variables;
	  }

	  RelayAsyncLoader.prototype.load = function load(node, dataID) {
	    var _this = this;

	    var dispose = function dispose() {
	      return _this._handleAbort();
	    };
	    this._traverse(node, dataID);
	    return { dispose: dispose };
	  };

	  RelayAsyncLoader.prototype._getVariableValue = function _getVariableValue(name) {
	    __webpack_require__(1)(this._variables.hasOwnProperty(name), 'RelayAsyncLoader(): Undefined variable `%s`.', name);
	    return this._variables[name];
	  };

	  RelayAsyncLoader.prototype._handleComplete = function _handleComplete() {
	    if (!this._done) {
	      this._done = true;
	      this._callback({ status: 'complete' });
	    }
	  };

	  RelayAsyncLoader.prototype._handleError = function _handleError(error) {
	    if (!this._done) {
	      this._done = true;
	      this._callback({
	        error: error,
	        status: 'error'
	      });
	    }
	  };

	  RelayAsyncLoader.prototype._handleMissing = function _handleMissing() {
	    if (!this._done) {
	      this._done = true;
	      this._callback({ status: 'missing' });
	    }
	  };

	  RelayAsyncLoader.prototype._handleAbort = function _handleAbort() {
	    if (!this._done) {
	      this._done = true;
	      this._callback({ status: 'aborted' });
	    }
	  };

	  RelayAsyncLoader.prototype._traverse = function _traverse(node, dataID) {
	    // Don't load the same node twice:
	    if (!this._target.has(dataID)) {
	      this._loadAndTraverse(node, dataID);
	    } else {
	      this._loadingCount++;
	      var record = this._target.get(dataID);
	      if (record) {
	        this._traverseSelections(node.selections, record);
	      }
	      this._loadingCount--;
	      if (this._loadingCount === 0) {
	        this._handleComplete();
	      }
	    }
	  };

	  RelayAsyncLoader.prototype._loadAndTraverse = function _loadAndTraverse(node, dataID) {
	    var _this2 = this;

	    this._loadingCount++;
	    this._source.load(dataID, function (error, record) {
	      if (_this2._done) {
	        return;
	      }
	      if (error) {
	        _this2._handleError(error);
	      } else if (record === undefined) {
	        _this2._handleMissing();
	      } else {
	        if (record === null) {
	          _this2._target['delete'](dataID);
	        } else {
	          _this2._target.set(dataID, record);
	          _this2._traverseSelections(node.selections, record);
	        }
	        _this2._loadingCount--;
	        if (_this2._loadingCount === 0) {
	          _this2._handleComplete();
	        }
	      }
	    });
	  };

	  RelayAsyncLoader.prototype._traverseSelections = function _traverseSelections(selections, record) {
	    var _this3 = this;

	    selections.every(function (selection) {
	      switch (selection.kind) {
	        case SCALAR_FIELD:
	          _this3._prepareScalar(selection, record);
	          break;
	        case LINKED_FIELD:
	          if (selection.plural) {
	            _this3._preparePluralLink(selection, record);
	          } else {
	            _this3._prepareLink(selection, record);
	          }
	          break;
	        case CONDITION:
	          var conditionValue = _this3._getVariableValue(selection.condition);
	          if (conditionValue === selection.passingValue) {
	            _this3._traverseSelections(selection.selections, record);
	          }
	          break;
	        case INLINE_FRAGMENT:
	          var typeName = __webpack_require__(2).getType(record);
	          if (typeName != null && typeName === selection.type) {
	            _this3._traverseSelections(selection.selections, record);
	          }
	          break;
	        case LINKED_HANDLE:
	          // Handles have no selections themselves; traverse the original field
	          // where the handle was set-up instead.
	          var handleField = __webpack_require__(73)(selection, selections, _this3._variables);
	          if (handleField.plural) {
	            _this3._preparePluralLink(handleField, record);
	          } else {
	            _this3._prepareLink(handleField, record);
	          }
	          break;
	        default:
	          __webpack_require__(1)(selection.kind === SCALAR_FIELD, 'RelayAsyncLoader(): Unexpected ast kind `%s`.', selection.kind);
	      }
	      return !_this3._done;
	    });
	  };

	  RelayAsyncLoader.prototype._prepareScalar = function _prepareScalar(field, record) {
	    var storageKey = getStorageKey(field, this._variables);
	    var fieldValue = __webpack_require__(2).getValue(record, storageKey);
	    if (fieldValue === undefined) {
	      this._handleMissing();
	    }
	  };

	  RelayAsyncLoader.prototype._prepareLink = function _prepareLink(field, record) {
	    var storageKey = getStorageKey(field, this._variables);
	    var linkedID = __webpack_require__(2).getLinkedRecordID(record, storageKey);

	    if (linkedID === undefined) {
	      this._handleMissing();
	    } else if (linkedID != null) {
	      this._traverse(field, linkedID);
	    }
	  };

	  RelayAsyncLoader.prototype._preparePluralLink = function _preparePluralLink(field, record) {
	    var _this4 = this;

	    var storageKey = getStorageKey(field, this._variables);
	    var linkedIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);

	    if (linkedIDs === undefined) {
	      this._handleMissing();
	    } else if (linkedIDs) {
	      linkedIDs.forEach(function (linkedID) {
	        if (linkedID != null) {
	          _this4._traverse(field, linkedID);
	        }
	      });
	    }
	  };

	  return RelayAsyncLoader;
	}();

	module.exports = {
	  check: check,
	  load: load
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayConnectionHandler
	 * 
	 */

	'use strict';

	var _set2 = _interopRequireDefault(__webpack_require__(48));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(96),
	    CURSOR = _require.CURSOR,
	    EDGES = _require.EDGES,
	    NODE = _require.NODE,
	    END_CURSOR = _require.END_CURSOR,
	    HAS_NEXT_PAGE = _require.HAS_NEXT_PAGE,
	    HAS_PREV_PAGE = _require.HAS_PREV_PAGE,
	    PAGE_INFO = _require.PAGE_INFO,
	    PAGE_INFO_TYPE = _require.PAGE_INFO_TYPE,
	    START_CURSOR = _require.START_CURSOR;

	var CONNECTION = 'connection';

	// Per-instance incrementing index used to generate unique edge IDs
	var NEXT_EDGE_INDEX = '__connection_next_edge_index';

	/**
	 * @public
	 *
	 * A default runtime handler for connection fields that appends newly fetched
	 * edges onto the end of a connection, regardless of the arguments used to fetch
	 * those edges.
	 */
	function update(proxy, payload) {
	  var record = proxy.get(payload.dataID);
	  if (!record) {
	    return;
	  }

	  var serverConnection = record.getLinkedRecord(payload.fieldKey);
	  var serverPageInfo = serverConnection && serverConnection.getLinkedRecord(PAGE_INFO);
	  if (!serverConnection) {
	    record.setValue(null, payload.handleKey);
	    return;
	  }
	  var clientConnection = record.getLinkedRecord(payload.handleKey);
	  var clientPageInfo = clientConnection && clientConnection.getLinkedRecord(PAGE_INFO);
	  if (!clientConnection) {
	    // Initial fetch with data: copy fields from the server record
	    var connection = proxy.create(__webpack_require__(16)(record.getDataID(), payload.handleKey), serverConnection.getType());
	    connection.setValue(0, NEXT_EDGE_INDEX);
	    connection.copyFieldsFrom(serverConnection);
	    var serverEdges = serverConnection.getLinkedRecords(EDGES);
	    if (serverEdges) {
	      serverEdges = serverEdges.map(function (edge) {
	        return buildConnectionEdge(proxy, connection, edge);
	      });
	      connection.setLinkedRecords(serverEdges, EDGES);
	    }
	    record.setLinkedRecord(connection, payload.handleKey);

	    clientPageInfo = proxy.create(__webpack_require__(16)(connection.getDataID(), PAGE_INFO), PAGE_INFO_TYPE);
	    clientPageInfo.setValue(false, HAS_NEXT_PAGE);
	    clientPageInfo.setValue(false, HAS_PREV_PAGE);
	    clientPageInfo.setValue(null, END_CURSOR);
	    clientPageInfo.setValue(null, START_CURSOR);
	    if (serverPageInfo) {
	      clientPageInfo.copyFieldsFrom(serverPageInfo);
	    }
	    connection.setLinkedRecord(clientPageInfo, PAGE_INFO);
	  } else {
	    var _connection = clientConnection;
	    // Subsequent fetches:
	    // - merge prev/next edges, de-duplicating by node id
	    // - synthesize page info fields
	    var _serverEdges = serverConnection.getLinkedRecords(EDGES);
	    if (_serverEdges) {
	      _serverEdges = _serverEdges.map(function (edge) {
	        return buildConnectionEdge(proxy, _connection, edge);
	      });
	    }
	    var prevEdges = _connection.getLinkedRecords(EDGES);
	    var nextEdges = [];
	    var args = payload.args;
	    if (prevEdges && _serverEdges) {
	      if (args.after != null) {
	        // Forward pagination from the end of the connection: append edges
	        if (clientPageInfo && args.after === clientPageInfo.getValue(END_CURSOR)) {
	          var nodeIDs = new _set2['default']();
	          mergeEdges(prevEdges, nextEdges, nodeIDs);
	          mergeEdges(_serverEdges, nextEdges, nodeIDs);
	        } else {
	          __webpack_require__(23)(false, 'RelayConnectionHandler: Unexpected after cursor `%s`, edges must ' + 'be fetched from the end of the list (`%s`).', args.after, clientPageInfo && clientPageInfo.getValue(END_CURSOR));
	          return;
	        }
	      } else if (args.before != null) {
	        // Backward pagination from the start of the connection: prepend edges
	        if (clientPageInfo && args.before === clientPageInfo.getValue(START_CURSOR)) {
	          var _nodeIDs = new _set2['default']();
	          mergeEdges(_serverEdges, nextEdges, _nodeIDs);
	          mergeEdges(prevEdges, nextEdges, _nodeIDs);
	        } else {
	          __webpack_require__(23)(false, 'RelayConnectionHandler: Unexpected before cursor `%s`, edges must ' + 'be fetched from the beginning of the list (`%s`).', args.before, clientPageInfo && clientPageInfo.getValue(START_CURSOR));
	          return;
	        }
	      } else {
	        // The connection was refetched from the beginning/end: replace edges
	        nextEdges = _serverEdges;
	      }
	    } else if (_serverEdges) {
	      nextEdges = _serverEdges;
	    } else {
	      nextEdges = prevEdges;
	    }
	    // Update edges and page info only if edges were updated, the null check is
	    // for Flow (prevEdges could be null).
	    if (nextEdges != null && nextEdges !== prevEdges) {
	      _connection.setLinkedRecords(nextEdges, EDGES);
	      if (clientPageInfo && serverPageInfo) {
	        if (args.before != null || args.after == null && args.last) {
	          clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_PREV_PAGE), HAS_PREV_PAGE);
	          var startCursor = serverPageInfo.getValue(START_CURSOR);
	          if (typeof startCursor === 'string') {
	            clientPageInfo.setValue(startCursor, START_CURSOR);
	          }
	        } else if (args.after != null || args.before == null && args.first) {
	          clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_NEXT_PAGE), HAS_NEXT_PAGE);
	          var endCursor = serverPageInfo.getValue(END_CURSOR);
	          if (typeof endCursor === 'string') {
	            clientPageInfo.setValue(endCursor, END_CURSOR);
	          }
	        }
	      }
	    }
	  }
	}

	/**
	 * @public
	 *
	 * Given a record and the name of the schema field for which a connection was
	 * fetched, returns the linked connection record.
	 *
	 * Example:
	 *
	 * Given that data has already been fetched on some user `<id>` on the `friends`
	 * field:
	 *
	 * ```
	 * fragment FriendsFragment on User {
	 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
	 *    edges {
	 *      node {
	 *        id
	 *        }
	 *      }
	 *   }
	 * }
	 * ```
	 *
	 * The `friends` connection record can be accessed with:
	 *
	 * ```
	 * proxy => {
	 *   const user = proxy.get('<id>');
	 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
	 *   // Access fields on the connection:
	 *   const edges = friends.getLinkedRecords('edges');
	 * }
	 * ```
	 *
	 * TODO: t15733312
	 * Currently we haven't run into this case yet, but we need to add a `getConnections`
	 * that returns an array of the connections under the same `key` regardless of the variables.
	 */
	function getConnection(record, key, filters) {
	  var handleKey = __webpack_require__(45)(CONNECTION, key, null);
	  return record.getLinkedRecord(handleKey, filters);
	}

	/**
	 * @public
	 *
	 * Inserts an edge after the given cursor, or at the end of the list if no
	 * cursor is provided.
	 *
	 * Example:
	 *
	 * Given that data has already been fetched on some user `<id>` on the `friends`
	 * field:
	 *
	 * ```
	 * fragment FriendsFragment on User {
	 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
	 *    edges {
	 *      node {
	 *        id
	 *        }
	 *      }
	 *   }
	 * }
	 * ```
	 *
	 * An edge can be appended with:
	 *
	 * ```
	 * proxy => {
	 *   const user = proxy.get('<id>');
	 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
	 *   const edge = proxy.create('<edge-id>', 'FriendsEdge');
	 *   RelayConnectionHandler.insertEdgeAfter(friends, edge);
	 * }
	 * ```
	 */
	function insertEdgeAfter(record, newEdge, cursor) {
	  var edges = record.getLinkedRecords(EDGES);
	  if (!edges) {
	    record.setLinkedRecords([newEdge], EDGES);
	    return;
	  }
	  var nextEdges = void 0;
	  if (cursor == null) {
	    nextEdges = edges.concat(newEdge);
	  } else {
	    nextEdges = [];
	    var foundCursor = false;
	    for (var ii = 0; ii < edges.length; ii++) {
	      var edge = edges[ii];
	      nextEdges.push(edge);
	      if (edge == null) {
	        continue;
	      }
	      var edgeCursor = edge.getValue(CURSOR);
	      if (cursor === edgeCursor) {
	        nextEdges.push(newEdge);
	        foundCursor = true;
	      }
	    }
	    if (!foundCursor) {
	      nextEdges.push(newEdge);
	    }
	  }
	  record.setLinkedRecords(nextEdges, EDGES);
	}

	/**
	 * @public
	 *
	 * Creates an edge for a connection record, given a node and edge type.
	 */
	function createEdge(proxy, record, node, edgeType) {
	  // An index-based client ID could easily conflict (unless it was
	  // auto-incrementing, but there is nowhere to the store the id)
	  // Instead, construct a client ID based on the connection ID and node ID,
	  // which will only conflict if the same node is added to the same connection
	  // twice. This is acceptable since the `insertEdge*` functions ignore
	  // duplicates.
	  var edgeID = __webpack_require__(16)(record.getDataID(), node.getDataID());
	  var edge = proxy.create(edgeID, edgeType);
	  edge.setLinkedRecord(node, NODE);
	  return edge;
	}

	/**
	 * @public
	 *
	 * Inserts an edge before the given cursor, or at the beginning of the list if
	 * no cursor is provided.
	 *
	 * Example:
	 *
	 * Given that data has already been fetched on some user `<id>` on the `friends`
	 * field:
	 *
	 * ```
	 * fragment FriendsFragment on User {
	 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
	 *    edges {
	 *      node {
	 *        id
	 *        }
	 *      }
	 *   }
	 * }
	 * ```
	 *
	 * An edge can be prepended with:
	 *
	 * ```
	 * proxy => {
	 *   const user = proxy.get('<id>');
	 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
	 *   const edge = proxy.create('<edge-id>', 'FriendsEdge');
	 *   RelayConnectionHandler.insertEdgeBefore(friends, edge);
	 * }
	 * ```
	 */
	function insertEdgeBefore(record, newEdge, cursor) {
	  var edges = record.getLinkedRecords(EDGES);
	  if (!edges) {
	    record.setLinkedRecords([newEdge], EDGES);
	    return;
	  }
	  var nextEdges = void 0;
	  if (cursor == null) {
	    nextEdges = [newEdge].concat(edges);
	  } else {
	    nextEdges = [];
	    var foundCursor = false;
	    for (var ii = 0; ii < edges.length; ii++) {
	      var edge = edges[ii];
	      if (edge != null) {
	        var edgeCursor = edge.getValue(CURSOR);
	        if (cursor === edgeCursor) {
	          nextEdges.push(newEdge);
	          foundCursor = true;
	        }
	      }
	      nextEdges.push(edge);
	    }
	    if (!foundCursor) {
	      nextEdges.unshift(newEdge);
	    }
	  }
	  record.setLinkedRecords(nextEdges, EDGES);
	}

	/**
	 * @public
	 *
	 * Remove any edges whose `node.id` matches the given id.
	 */
	function deleteNode(record, nodeID) {
	  var edges = record.getLinkedRecords(EDGES);
	  if (!edges) {
	    return;
	  }
	  var nextEdges = void 0;
	  for (var ii = 0; ii < edges.length; ii++) {
	    var edge = edges[ii];
	    var node = edge && edge.getLinkedRecord(NODE);
	    if (node != null && node.getDataID() === nodeID) {
	      if (nextEdges === undefined) {
	        nextEdges = edges.slice(0, ii);
	      }
	    } else if (nextEdges !== undefined) {
	      nextEdges.push(edge);
	    }
	  }
	  if (nextEdges !== undefined) {
	    record.setLinkedRecords(nextEdges, EDGES);
	  }
	}

	/**
	 * @internal
	 *
	 * Creates a copy of an edge with a unique ID based on per-connection-instance
	 * incrementing edge index. This is necessary to avoid collisions between edges,
	 * which can occur because (edge) client IDs are assigned deterministically
	 * based on the path from the nearest node with an id.
	 *
	 * Example: if the first N edges of the same connection are refetched, the edges
	 * from the second fetch will be assigned the same IDs as the first fetch, even
	 * though the nodes they point to may be different (or the same and in different
	 * order).
	 */
	function buildConnectionEdge(proxy, connection, edge) {
	  if (edge == null) {
	    return edge;
	  }
	  var edgeIndex = connection.getValue(NEXT_EDGE_INDEX);
	  __webpack_require__(1)(typeof edgeIndex === 'number', 'RelayConnectionHandler: Expected %s to be a number, got `%s`.', NEXT_EDGE_INDEX, edgeIndex);
	  var edgeID = __webpack_require__(16)(connection.getDataID(), EDGES, edgeIndex);
	  var connectionEdge = proxy.create(edgeID, edge.getType());
	  connectionEdge.copyFieldsFrom(edge);
	  connection.setValue(edgeIndex + 1, NEXT_EDGE_INDEX);
	  return connectionEdge;
	}

	/**
	 * @internal
	 *
	 * Adds the source edges to the target edges, skipping edges with
	 * duplicate cursors or node ids.
	 */
	function mergeEdges(sourceEdges, targetEdges, nodeIDs) {
	  for (var ii = 0; ii < sourceEdges.length; ii++) {
	    var edge = sourceEdges[ii];
	    if (!edge) {
	      continue;
	    }
	    var node = edge.getLinkedRecord(NODE);
	    var nodeID = node && node.getValue('id');
	    if (nodeID) {
	      if (nodeIDs.has(nodeID)) {
	        continue;
	      }
	      nodeIDs.add(nodeID);
	    }
	    targetEdges.push(edge);
	  }
	}

	module.exports = {
	  createEdge: createEdge,
	  deleteNode: deleteNode,
	  getConnection: getConnection,
	  insertEdgeAfter: insertEdgeAfter,
	  insertEdgeBefore: insertEdgeBefore,
	  update: update
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayConnectionInterface
	 */

	'use strict';

	module.exports = __webpack_require__(101);

/***/ },
/* 97 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayDefaultHandleKey
	 * 
	 */

	'use strict';

	module.exports = {
	  DEFAULT_HANDLE_KEY: ''
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayError
	 * 
	 */

	'use strict';

	/**
	 * @internal
	 *
	 * Factory methods for constructing errors in Relay.
	 */
	var RelayError = {
	  create: function create(name, format) {
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }

	    return createError('mustfix', name, format, args);
	  },
	  createWarning: function createWarning(name, format) {
	    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	      args[_key2 - 2] = arguments[_key2];
	    }

	    return createError('warn', name, format, args);
	  }
	};

	/**
	 * @private
	 */
	function createError(type, name, format, args) {
	  /*eslint-disable fb-www/sprintf-like-args */
	  var error = new Error(__webpack_require__(179).apply(undefined, [format].concat(args)));
	  /*eslint-enable fb-www/sprintf-like-args */
	  error.name = name;
	  error.type = type;
	  error.framesToPop = 2;
	  return error;
	}

	module.exports = RelayError;

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayMarkSweepStore
	 * 
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(28));

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _set2 = _interopRequireDefault(__webpack_require__(48));

	var _map2 = _interopRequireDefault(__webpack_require__(117));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    UNPUBLISH_RECORD_SENTINEL = _require.UNPUBLISH_RECORD_SENTINEL;

	/**
	 * @public
	 *
	 * An implementation of the `Store` interface defined in `RelayStoreTypes`.
	 *
	 * Note that a Store takes ownership of all records provided to it: other
	 * objects may continue to hold a reference to such records but may not mutate
	 * them. The static Relay core is architected to avoid mutating records that may have been
	 * passed to a store: operations that mutate records will either create fresh
	 * records or clone existing records and modify the clones. Record immutability
	 * is also enforced in development mode by freezing all records passed to a store.
	 */
	var RelayMarkSweepStore = function () {
	  function RelayMarkSweepStore(source) {
	    (0, _classCallCheck3['default'])(this, RelayMarkSweepStore);

	    // Prevent mutation of a record from outside the store.
	    if (true) {
	      var storeIDs = source.getRecordIDs();
	      for (var ii = 0; ii < storeIDs.length; ii++) {
	        var record = source.get(storeIDs[ii]);
	        if (record) {
	          __webpack_require__(2).freeze(record);
	        }
	      }
	    }
	    this._hasScheduledGC = false;
	    this._index = 0;
	    this._recordSource = source;
	    this._roots = new _map2['default']();
	    this._subscriptions = new _set2['default']();
	    this._updatedRecordIDs = {};
	  }

	  RelayMarkSweepStore.prototype.getSource = function getSource() {
	    return this._recordSource;
	  };

	  RelayMarkSweepStore.prototype.retain = function retain(selector) {
	    var _this = this;

	    var index = this._index++;
	    var dispose = function dispose() {
	      _this._roots['delete'](index);
	      _this._scheduleGC();
	    };
	    this._roots.set(index, selector);
	    return { dispose: dispose };
	  };

	  RelayMarkSweepStore.prototype.lookup = function lookup(selector) {
	    var snapshot = __webpack_require__(70).read(this._recordSource, selector);
	    if (true) {
	      __webpack_require__(44)(snapshot);
	    }
	    return snapshot;
	  };

	  RelayMarkSweepStore.prototype.notify = function notify() {
	    var _this2 = this;

	    this._subscriptions.forEach(function (subscription) {
	      _this2._updateSubscription(subscription);
	    });
	    this._updatedRecordIDs = {};
	  };

	  RelayMarkSweepStore.prototype.publish = function publish(source) {
	    updateTargetFromSource(this._recordSource, source, this._updatedRecordIDs);
	  };

	  RelayMarkSweepStore.prototype.resolve = function resolve(target, selector, callback) {
	    __webpack_require__(94).load(this._recordSource, target, selector, callback);
	  };

	  RelayMarkSweepStore.prototype.subscribe = function subscribe(snapshot, callback) {
	    var _this3 = this;

	    var subscription = { callback: callback, snapshot: snapshot };
	    var dispose = function dispose() {
	      _this3._subscriptions['delete'](subscription);
	    };
	    this._subscriptions.add(subscription);
	    return { dispose: dispose };
	  };

	  RelayMarkSweepStore.prototype._updateSubscription = function _updateSubscription(subscription) {
	    var callback = subscription.callback,
	        snapshot = subscription.snapshot;

	    if (!__webpack_require__(113)(snapshot, this._updatedRecordIDs)) {
	      return;
	    }

	    var _RelayReader$read = __webpack_require__(70).read(this._recordSource, snapshot),
	        data = _RelayReader$read.data,
	        seenRecords = _RelayReader$read.seenRecords;

	    var nextData = __webpack_require__(115)(snapshot.data, data);
	    var nextSnapshot = (0, _extends3['default'])({}, snapshot, {
	      data: nextData,
	      seenRecords: seenRecords
	    });
	    if (true) {
	      __webpack_require__(44)(nextSnapshot);
	    }
	    subscription.snapshot = nextSnapshot;
	    if (nextSnapshot.data !== snapshot.data) {
	      callback(nextSnapshot);
	    }
	  };

	  RelayMarkSweepStore.prototype._scheduleGC = function _scheduleGC() {
	    var _this4 = this;

	    if (this._hasScheduledGC) {
	      return;
	    }
	    this._hasScheduledGC = true;
	    __webpack_require__(178)(function () {
	      _this4._gc();
	      _this4._hasScheduledGC = false;
	    });
	  };

	  RelayMarkSweepStore.prototype._gc = function _gc() {
	    var _this5 = this;

	    var references = new _set2['default']();
	    // Mark all records that are traversable from a root
	    this._roots.forEach(function (selector) {
	      __webpack_require__(105).mark(_this5._recordSource, selector, references);
	    });
	    // Short-circuit if *nothing* is referenced
	    if (!references.size) {
	      this._recordSource.clear();
	      return;
	    }
	    // Evict any unreferenced nodes
	    var storeIDs = this._recordSource.getRecordIDs();
	    for (var ii = 0; ii < storeIDs.length; ii++) {
	      var dataID = storeIDs[ii];
	      if (!references.has(dataID)) {
	        this._recordSource.remove(dataID);
	      }
	    }
	  };

	  return RelayMarkSweepStore;
	}();

	/**
	 * Updates the target with information from source, also updating a mapping of
	 * which records in the target were changed as a result.
	 */


	function updateTargetFromSource(target, source, updatedRecordIDs) {
	  var dataIDs = source.getRecordIDs();
	  for (var ii = 0; ii < dataIDs.length; ii++) {
	    var dataID = dataIDs[ii];
	    var sourceRecord = source.get(dataID);
	    var targetRecord = target.get(dataID);
	    // Prevent mutation of a record from outside the store.
	    if (true) {
	      if (sourceRecord) {
	        __webpack_require__(2).freeze(sourceRecord);
	      }
	    }
	    if (sourceRecord === UNPUBLISH_RECORD_SENTINEL) {
	      // Unpublish a record
	      target.remove(dataID);
	      updatedRecordIDs[dataID] = true;
	    } else if (sourceRecord && targetRecord) {
	      var nextRecord = __webpack_require__(2).update(targetRecord, sourceRecord);
	      if (nextRecord !== targetRecord) {
	        // Prevent mutation of a record from outside the store.
	        if (true) {
	          __webpack_require__(2).freeze(nextRecord);
	        }
	        updatedRecordIDs[dataID] = true;
	        target.set(dataID, nextRecord);
	      }
	    } else if (sourceRecord === null) {
	      target['delete'](dataID);
	      if (targetRecord !== null) {
	        updatedRecordIDs[dataID] = true;
	      }
	    } else if (sourceRecord) {
	      target.set(dataID, sourceRecord);
	      updatedRecordIDs[dataID] = true;
	    } // don't add explicit undefined
	  }
	}

	__webpack_require__(69).instrumentMethods(RelayMarkSweepStore.prototype, {
	  lookup: 'RelayMarkSweepStore.prototype.lookup',
	  notify: 'RelayMarkSweepStore.prototype.notify',
	  publish: 'RelayMarkSweepStore.prototype.publish',
	  retain: 'RelayMarkSweepStore.prototype.retain',
	  subscribe: 'RelayMarkSweepStore.prototype.subscribe'
	});

	module.exports = RelayMarkSweepStore;

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayNetwork
	 * 
	 */

	'use strict';

	var _require = __webpack_require__(4),
	    ROOT_ID = _require.ROOT_ID;

	/**
	 * Creates an implementation of the `Network` interface defined in
	 * `RelayNetworkTypes` given a single `fetch` function.
	 */
	function create(fetch, subscribe) {
	  function request(operation, variables, cacheConfig, uploadables) {
	    return fetch(operation, variables, cacheConfig, uploadables).then(function (payload) {
	      return normalizePayload(operation, variables, payload);
	    });
	  }

	  function requestStream(operation, variables, cacheConfig, _ref) {
	    var onCompleted = _ref.onCompleted,
	        onError = _ref.onError,
	        _onNext = _ref.onNext;

	    if (operation.query.operation === 'subscription') {
	      __webpack_require__(1)(subscribe, 'The default network layer does not support GraphQL Subscriptions. To use ' + 'Subscriptions, provide a custom network layer.');
	      return subscribe(operation, variables, null, {
	        onCompleted: onCompleted,
	        onError: onError,
	        onNext: function onNext(payload) {
	          var relayPayload = void 0;
	          try {
	            relayPayload = normalizePayload(operation, variables, payload);
	          } catch (err) {
	            onError && onError(err);
	            return;
	          }
	          _onNext && _onNext(relayPayload);
	        }
	      });
	    }

	    var pollInterval = cacheConfig && cacheConfig.poll;
	    if (pollInterval != null) {
	      return doFetchWithPolling(request, operation, variables, { onCompleted: onCompleted, onError: onError, onNext: _onNext }, pollInterval);
	    }

	    var isDisposed = false;
	    fetch(operation, variables, cacheConfig).then(function (payload) {
	      if (isDisposed) {
	        return;
	      }
	      var relayPayload = void 0;
	      try {
	        relayPayload = normalizePayload(operation, variables, payload);
	      } catch (err) {
	        onError && onError(err);
	        return;
	      }
	      _onNext && _onNext(relayPayload);
	      onCompleted && onCompleted();
	    }, function (error) {
	      if (isDisposed) {
	        return;
	      }
	      onError && onError(error);
	    })['catch'](rethrow);
	    return {
	      dispose: function dispose() {
	        isDisposed = true;
	      }
	    };
	  }

	  return {
	    fetch: fetch,
	    request: request,
	    requestStream: requestStream
	  };
	}

	function doFetchWithPolling(request, operation, variables, _ref2, pollInterval) {
	  var onCompleted = _ref2.onCompleted,
	      onError = _ref2.onError,
	      onNext = _ref2.onNext;

	  __webpack_require__(1)(pollInterval > 0, 'RelayNetwork: Expected pollInterval to be positive, got `%s`.', pollInterval);
	  var isDisposed = false;
	  var timeout = null;
	  var dispose = function dispose() {
	    if (!isDisposed) {
	      isDisposed = true;
	      timeout && clearTimeout(timeout);
	    }
	  };
	  function poll() {
	    request(operation, variables, { force: true }).then(function (payload) {
	      onNext && onNext(payload);
	      timeout = setTimeout(poll, pollInterval);
	    }, function (error) {
	      dispose();
	      onError && onError(error);
	    });
	  }
	  timeout = setTimeout(poll, pollInterval);

	  return { dispose: dispose };
	}

	function normalizePayload(operation, variables, payload) {
	  var data = payload.data,
	      errors = payload.errors;

	  if (data != null) {
	    return __webpack_require__(46)({
	      dataID: ROOT_ID,
	      node: operation.query,
	      variables: variables
	    }, data, errors, { handleStrippedNulls: true });
	  }
	  var error = __webpack_require__(98).create('RelayNetwork', 'No data returned for operation `%s`, got error(s):\n%s\n\nSee the error ' + '`source` property for more information.', operation.name, errors ? errors.map(function (_ref3) {
	    var message = _ref3.message;
	    return message;
	  }).join('\n') : '(No errors)');
	  error.source = { errors: errors, operation: operation, variables: variables };
	  throw error;
	}

	function rethrow(err) {
	  setTimeout(function () {
	    throw err;
	  }, 0);
	}

	module.exports = { create: create };

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayOSSConnectionInterface
	 * 
	 */

	'use strict';

	var _defineProperty3 = _interopRequireDefault(__webpack_require__(125));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var CLIENT_MUTATION_ID = 'clientMutationId';
	var CONNECTION_CALLS = {
	  'after': true,
	  'before': true,
	  'find': true,
	  'first': true,
	  'last': true,
	  'surrounds': true
	};
	var CURSOR = 'cursor';
	var EDGES = 'edges';
	var END_CURSOR = 'endCursor';
	var HAS_NEXT_PAGE = 'hasNextPage';
	var HAS_PREV_PAGE = 'hasPreviousPage';
	var NODE = 'node';
	var PAGE_INFO = 'pageInfo';
	var PAGE_INFO_TYPE = 'PageInfo';
	var REQUIRED_RANGE_CALLS = {
	  'find': true,
	  'first': true,
	  'last': true
	};
	var START_CURSOR = 'startCursor';

	/**
	 * @internal
	 *
	 * Defines logic relevant to the informal "Connection" GraphQL interface.
	 */
	var RelayOSSConnectionInterface = {
	  CLIENT_MUTATION_ID: CLIENT_MUTATION_ID,
	  CURSOR: CURSOR,
	  EDGES: EDGES,
	  END_CURSOR: END_CURSOR,
	  HAS_NEXT_PAGE: HAS_NEXT_PAGE,
	  HAS_PREV_PAGE: HAS_PREV_PAGE,
	  NODE: NODE,
	  PAGE_INFO: PAGE_INFO,
	  PAGE_INFO_TYPE: PAGE_INFO_TYPE,
	  START_CURSOR: START_CURSOR,

	  /**
	   * Whether `edges` fields are expected to have `source` fields.
	   */
	  EDGES_HAVE_SOURCE_FIELD: false,

	  /**
	   * Checks whether a call exists strictly to encode which parts of a connection
	   * to fetch. Fields that only differ by connection call values should have the
	   * same identity.
	   */
	  isConnectionCall: function isConnectionCall(call) {
	    return CONNECTION_CALLS.hasOwnProperty(call.name);
	  },


	  /**
	   * Checks whether a set of calls on a connection supply enough information to
	   * fetch the range fields (i.e. `edges` and `page_info`).
	   */
	  hasRangeCalls: function hasRangeCalls(calls) {
	    return calls.some(function (call) {
	      return REQUIRED_RANGE_CALLS.hasOwnProperty(call.name);
	    });
	  },


	  /**
	   * Gets a default record representing a connection's `PAGE_INFO`.
	   */
	  getDefaultPageInfo: function getDefaultPageInfo() {
	    var _ref;

	    return _ref = {}, (0, _defineProperty3['default'])(_ref, END_CURSOR, undefined), (0, _defineProperty3['default'])(_ref, HAS_NEXT_PAGE, false), (0, _defineProperty3['default'])(_ref, HAS_PREV_PAGE, false), (0, _defineProperty3['default'])(_ref, START_CURSOR, undefined), _ref;
	  }
	};

	module.exports = RelayOSSConnectionInterface;

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule RelayPublishQueue
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _set2 = _interopRequireDefault(__webpack_require__(48));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * Coordinates the concurrent modification of a `Store` due to optimistic and
	 * non-revertable client updates and server payloads:
	 * - Applies optimistic updates.
	 * - Reverts optimistic updates, rebasing any subsequent updates.
	 * - Commits client updates (typically for client schema extensions).
	 * - Commits server updates:
	 *   - Normalizes query/mutation/subscription responses.
	 *   - Executes handlers for "handle" fields.
	 *   - Reverts and reapplies pending optimistic updates.
	 */
	var RelayPublishQueue = function () {
	  // Optimistic updaters to add with the next `run()`.

	  // Payloads to apply with the next `run()`.


	  // A "negative" of all applied updaters. It can be published to the store to
	  // undo them in order to re-apply some of them for a rebase.
	  function RelayPublishQueue(store, handlerProvider) {
	    (0, _classCallCheck3['default'])(this, RelayPublishQueue);

	    this._backup = new (__webpack_require__(24))();
	    this._handlerProvider = handlerProvider || null;
	    this._pendingBackupRebase = false;
	    this._pendingPayloads = new _set2['default']();
	    this._pendingUpdaters = new _set2['default']();
	    this._pendingOptimisticUpdaters = new _set2['default']();
	    this._store = store;
	    this._appliedOptimisticUpdaters = new _set2['default']();
	  }

	  /**
	   * Schedule applying an optimistic updates on the next `run()`.
	   */

	  // Optimistic updaters that are already added and might be rerun in order to
	  // rebase them.

	  // Updaters to apply with the next `run()`. These mutate the store and should
	  // typically only mutate client schema extensions.

	  // True if the next `run()` should apply the backup and rerun all optimistic
	  // updates performing a rebase.


	  RelayPublishQueue.prototype.applyUpdate = function applyUpdate(updater) {
	    __webpack_require__(1)(!this._appliedOptimisticUpdaters.has(updater) && !this._pendingOptimisticUpdaters.has(updater), 'RelayPublishQueue: Cannot apply the same update function more than ' + 'once concurrently.');
	    this._pendingOptimisticUpdaters.add(updater);
	  };

	  /**
	   * Schedule reverting an optimistic updates on the next `run()`.
	   */


	  RelayPublishQueue.prototype.revertUpdate = function revertUpdate(updater) {
	    if (this._pendingOptimisticUpdaters.has(updater)) {
	      // Reverted before it was applied
	      this._pendingOptimisticUpdaters['delete'](updater);
	    } else if (this._appliedOptimisticUpdaters.has(updater)) {
	      this._pendingBackupRebase = true;
	      this._appliedOptimisticUpdaters['delete'](updater);
	    }
	  };

	  /**
	   * Schedule a revert of all optimistic updates on the next `run()`.
	   */


	  RelayPublishQueue.prototype.revertAll = function revertAll() {
	    this._pendingBackupRebase = true;
	    this._pendingOptimisticUpdaters.clear();
	    this._appliedOptimisticUpdaters.clear();
	  };

	  /**
	   * Schedule applying a payload to the store on the next `run()`.
	   */


	  RelayPublishQueue.prototype.commitPayload = function commitPayload(selector, _ref, updater) {
	    var fieldPayloads = _ref.fieldPayloads,
	        source = _ref.source;

	    this._pendingBackupRebase = true;
	    this._pendingPayloads.add({ fieldPayloads: fieldPayloads, selector: selector, source: source, updater: updater });
	  };

	  /**
	   * Schedule an updater to mutate the store on the next `run()` typically to
	   * update client schema fields.
	   */


	  RelayPublishQueue.prototype.commitUpdate = function commitUpdate(updater) {
	    this._pendingBackupRebase = true;
	    this._pendingUpdaters.add(updater);
	  };

	  /**
	   * Execute all queued up operations from the other public methods.
	   */


	  RelayPublishQueue.prototype.run = function run() {
	    if (this._pendingBackupRebase && this._backup.size()) {
	      this._store.publish(this._backup);
	      this._backup = new (__webpack_require__(24))();
	    }
	    this._commitPayloads();
	    this._commitUpdaters();
	    this._applyUpdates();
	    this._pendingBackupRebase = false;
	    this._store.notify();
	  };

	  RelayPublishQueue.prototype._commitPayloads = function _commitPayloads() {
	    var _this = this;

	    if (!this._pendingPayloads.size) {
	      return;
	    }
	    this._pendingPayloads.forEach(function (_ref2) {
	      var fieldPayloads = _ref2.fieldPayloads,
	          selector = _ref2.selector,
	          source = _ref2.source,
	          updater = _ref2.updater;

	      var mutator = new (__webpack_require__(42))(_this._store.getSource(), source);
	      var proxy = new (__webpack_require__(104))(mutator, selector);
	      if (fieldPayloads && fieldPayloads.length) {
	        fieldPayloads.forEach(function (fieldPayload) {
	          var handler = _this._handlerProvider && _this._handlerProvider(fieldPayload.handle);
	          __webpack_require__(1)(handler, 'RelayStaticEnvironment: Expected a handler to be provided for ' + 'handle `%s`.', fieldPayload.handle);
	          handler.update(proxy, fieldPayload);
	        });
	      }
	      if (updater) {
	        updater(proxy);
	      }
	      // Publish the server data first so that it is reflected in the mutation
	      // backup created during the rebase
	      _this._store.publish(source);
	    });
	    this._pendingPayloads.clear();
	  };

	  RelayPublishQueue.prototype._commitUpdaters = function _commitUpdaters() {
	    var _this2 = this;

	    if (!this._pendingUpdaters.size) {
	      return;
	    }
	    var sink = new (__webpack_require__(24))();
	    this._pendingUpdaters.forEach(function (updater) {
	      var mutator = new (__webpack_require__(42))(_this2._store.getSource(), sink);
	      var proxy = new (__webpack_require__(43))(mutator);
	      updater(proxy);
	    });
	    this._store.publish(sink);
	    this._pendingUpdaters.clear();
	  };

	  RelayPublishQueue.prototype._applyUpdates = function _applyUpdates() {
	    var _this3 = this;

	    if (this._pendingOptimisticUpdaters.size || this._pendingBackupRebase && this._appliedOptimisticUpdaters.size) {
	      var sink = new (__webpack_require__(24))();
	      var mutator = new (__webpack_require__(42))(this._store.getSource(), sink, this._backup);
	      var proxy = new (__webpack_require__(43))(mutator);

	      // rerun all updaters in case we are running a rebase
	      if (this._pendingBackupRebase && this._appliedOptimisticUpdaters.size) {
	        this._appliedOptimisticUpdaters.forEach(function (updater) {
	          return updater(proxy);
	        });
	      }

	      // apply any new updaters
	      if (this._pendingOptimisticUpdaters.size) {
	        this._pendingOptimisticUpdaters.forEach(function (updater) {
	          updater(proxy);
	          _this3._appliedOptimisticUpdaters.add(updater);
	        });
	        this._pendingOptimisticUpdaters.clear();
	      }

	      this._store.publish(sink);
	    }
	  };

	  return RelayPublishQueue;
	}();

	module.exports = RelayPublishQueue;

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRecordProxy
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _stringify2 = _interopRequireDefault(__webpack_require__(18));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * @internal
	 *
	 * A helper class for manipulating a given record from a record source via an
	 * imperative/OO-style API.
	 */
	var RelayRecordProxy = function () {
	  function RelayRecordProxy(source, mutator, dataID) {
	    (0, _classCallCheck3['default'])(this, RelayRecordProxy);

	    this._dataID = dataID;
	    this._mutator = mutator;
	    this._source = source;
	  }

	  RelayRecordProxy.prototype.copyFieldsFrom = function copyFieldsFrom(source) {
	    this._mutator.copyFields(source.getDataID(), this._dataID);
	  };

	  RelayRecordProxy.prototype.getDataID = function getDataID() {
	    return this._dataID;
	  };

	  RelayRecordProxy.prototype.getType = function getType() {
	    var type = this._mutator.getType(this._dataID);
	    __webpack_require__(1)(type != null, 'RelayRecordProxy: Cannot get the type of deleted record `%s`.', this._dataID);
	    return type;
	  };

	  RelayRecordProxy.prototype.getValue = function getValue(name, args) {
	    var storageKey = args ? __webpack_require__(8)(name, args) : name;
	    return this._mutator.getValue(this._dataID, storageKey);
	  };

	  RelayRecordProxy.prototype.setValue = function setValue(value, name, args) {
	    __webpack_require__(1)(value == null || typeof value !== 'object', 'RelayRecordProxy#setValue(): Expected a scalar value, got `%s`.', (0, _stringify2['default'])(value));
	    var storageKey = args ? __webpack_require__(8)(name, args) : name;
	    this._mutator.setValue(this._dataID, storageKey, value);
	    return this;
	  };

	  RelayRecordProxy.prototype.getLinkedRecord = function getLinkedRecord(name, args) {
	    var storageKey = args ? __webpack_require__(8)(name, args) : name;
	    var linkedID = this._mutator.getLinkedRecordID(this._dataID, storageKey);
	    return linkedID != null ? this._source.get(linkedID) : linkedID;
	  };

	  RelayRecordProxy.prototype.setLinkedRecord = function setLinkedRecord(record, name, args) {
	    __webpack_require__(1)(record instanceof RelayRecordProxy, 'RelayRecordProxy#setLinkedRecord(): Expected a record, got `%s`.', record);
	    var storageKey = args ? __webpack_require__(8)(name, args) : name;
	    var linkedID = record.getDataID();
	    this._mutator.setLinkedRecordID(this._dataID, storageKey, linkedID);
	    return this;
	  };

	  RelayRecordProxy.prototype.getOrCreateLinkedRecord = function getOrCreateLinkedRecord(name, typeName, args) {
	    var linkedRecord = this.getLinkedRecord(name, args);
	    if (!linkedRecord) {
	      var storageKey = args ? __webpack_require__(8)(name, args) : name;
	      var clientID = __webpack_require__(16)(this.getDataID(), storageKey);
	      linkedRecord = this._source.create(clientID, typeName);
	      this.setLinkedRecord(linkedRecord, name, args);
	    }
	    return linkedRecord;
	  };

	  RelayRecordProxy.prototype.getLinkedRecords = function getLinkedRecords(name, args) {
	    var _this = this;

	    var storageKey = args ? __webpack_require__(8)(name, args) : name;
	    var linkedIDs = this._mutator.getLinkedRecordIDs(this._dataID, storageKey);
	    if (linkedIDs == null) {
	      return linkedIDs;
	    }
	    return linkedIDs.map(function (linkedID) {
	      return linkedID != null ? _this._source.get(linkedID) : linkedID;
	    });
	  };

	  RelayRecordProxy.prototype.setLinkedRecords = function setLinkedRecords(records, name, args) {
	    __webpack_require__(1)(Array.isArray(records), 'RelayRecordProxy#setLinkedRecords(): Expected records to be an array, got `%s`.', records);
	    var storageKey = args ? __webpack_require__(8)(name, args) : name;
	    var linkedIDs = records.map(function (record) {
	      return record && record.getDataID();
	    });
	    this._mutator.setLinkedRecordIDs(this._dataID, storageKey, linkedIDs);
	    return this;
	  };

	  return RelayRecordProxy;
	}();

	module.exports = RelayRecordProxy;

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayRecordSourceSelectorProxy
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(127));

	var _inherits3 = _interopRequireDefault(__webpack_require__(126));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(4),
	    getStorageKey = _require.getStorageKey;

	/**
	 * @internal
	 *
	 * A subclass of RecordSourceProxy that provides convenience methods for
	 * accessing the root fields of a given query/mutation. These fields accept
	 * complex arguments and it can be tedious to re-construct the correct sets of
	 * arguments to pass to e.g. `getRoot().getLinkedRecord()`.
	 */
	var RelayRecordSourceSelectorProxy = function (_RelayRecordSourcePro) {
	  (0, _inherits3['default'])(RelayRecordSourceSelectorProxy, _RelayRecordSourcePro);

	  function RelayRecordSourceSelectorProxy(mutator, selector, handlerProvider) {
	    (0, _classCallCheck3['default'])(this, RelayRecordSourceSelectorProxy);

	    var _this = (0, _possibleConstructorReturn3['default'])(this, _RelayRecordSourcePro.call(this, mutator, handlerProvider));

	    _this._selector = selector;
	    return _this;
	  }

	  RelayRecordSourceSelectorProxy.prototype._getRootField = function _getRootField(fieldName, plural) {
	    var field = this._selector.node.selections.find(function (selection) {
	      return selection.kind === 'LinkedField' && selection.name === fieldName;
	    });
	    __webpack_require__(1)(field && field.kind === 'LinkedField', 'RelayRecordSourceSelectorProxy#getRootField(): Cannot find root ' + 'field `%s`, no such field is defined on GraphQL document `%s`.', fieldName, this._selector.node.name);
	    __webpack_require__(1)(field.plural === plural, 'RelayRecordSourceSelectorProxy#getRootField(): Expected root field ' + '`%s` to be %s.', fieldName, plural ? 'plural' : 'singular');
	    return field;
	  };

	  RelayRecordSourceSelectorProxy.prototype.getRootField = function getRootField(fieldName) {
	    var field = this._getRootField(fieldName, false);
	    var storageKey = getStorageKey(field, this._selector.variables);
	    return this.getRoot().getLinkedRecord(storageKey);
	  };

	  RelayRecordSourceSelectorProxy.prototype.getPluralRootField = function getPluralRootField(fieldName) {
	    var field = this._getRootField(fieldName, true);
	    var storageKey = getStorageKey(field, this._selector.variables);
	    return this.getRoot().getLinkedRecords(storageKey);
	  };

	  return RelayRecordSourceSelectorProxy;
	}(__webpack_require__(43));

	module.exports = RelayRecordSourceSelectorProxy;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayReferenceMarker
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var CONDITION = __webpack_require__(3).CONDITION,
	    FRAGMENT_SPREAD = __webpack_require__(3).FRAGMENT_SPREAD,
	    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
	    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
	    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
	    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD,
	    SCALAR_HANDLE = __webpack_require__(3).SCALAR_HANDLE;

	var getStorageKey = __webpack_require__(4).getStorageKey;

	function mark(recordSource, selector, references) {
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  var marker = new RelayReferenceMarker(recordSource, variables, references);
	  marker.mark(node, dataID);
	}

	/**
	 * @private
	 */

	var RelayReferenceMarker = function () {
	  function RelayReferenceMarker(recordSource, variables, references) {
	    (0, _classCallCheck3['default'])(this, RelayReferenceMarker);

	    this._references = references;
	    this._recordSource = recordSource;
	    this._variables = variables;
	  }

	  RelayReferenceMarker.prototype.mark = function mark(node, dataID) {
	    this._traverse(node, dataID);
	  };

	  RelayReferenceMarker.prototype._traverse = function _traverse(node, dataID) {
	    this._references.add(dataID);
	    var record = this._recordSource.get(dataID);
	    if (record == null) {
	      return;
	    }
	    this._traverseSelections(node.selections, record);
	  };

	  RelayReferenceMarker.prototype._getVariableValue = function _getVariableValue(name) {
	    __webpack_require__(1)(this._variables.hasOwnProperty(name), 'RelayReferenceMarker(): Undefined variable `%s`.', name);
	    return this._variables[name];
	  };

	  RelayReferenceMarker.prototype._traverseSelections = function _traverseSelections(selections, record) {
	    var _this = this;

	    selections.forEach(function (selection) {
	      if (selection.kind === LINKED_FIELD) {
	        if (selection.plural) {
	          _this._traversePluralLink(selection, record);
	        } else {
	          _this._traverseLink(selection, record);
	        }
	      } else if (selection.kind === CONDITION) {
	        var conditionValue = _this._getVariableValue(selection.condition);
	        if (conditionValue === selection.passingValue) {
	          _this._traverseSelections(selection.selections, record);
	        }
	      } else if (selection.kind === INLINE_FRAGMENT) {
	        var typeName = __webpack_require__(2).getType(record);
	        if (typeName != null && typeName === selection.type) {
	          _this._traverseSelections(selection.selections, record);
	        }
	      } else if (selection.kind === FRAGMENT_SPREAD) {
	        __webpack_require__(1)(false, 'RelayReferenceMarker(): Unexpected fragment spread `...%s`, ' + 'expected all fragments to be inlined.', selection.name);
	      } else if (selection.kind === LINKED_HANDLE) {
	        // The selections for a "handle" field are the same as those of the
	        // original linked field where the handle was applied. Reference marking
	        // therefore requires traversing the original field selections against
	        // the synthesized client field.
	        //
	        // TODO: Instead of finding the source field in `selections`, change
	        // the concrete structure to allow shared subtrees, and have the linked
	        // handle directly refer to the same selections as the LinkedField that
	        // it was split from.
	        var handleField = __webpack_require__(73)(selection, selections, _this._variables);
	        if (handleField.plural) {
	          _this._traversePluralLink(handleField, record);
	        } else {
	          _this._traverseLink(handleField, record);
	        }
	      } else {
	        __webpack_require__(1)(selection.kind === SCALAR_FIELD || selection.kind === SCALAR_HANDLE, 'RelayReferenceMarker(): Unexpected ast kind `%s`.', selection.kind);
	      }
	    });
	  };

	  RelayReferenceMarker.prototype._traverseLink = function _traverseLink(field, record) {
	    var storageKey = getStorageKey(field, this._variables);
	    var linkedID = __webpack_require__(2).getLinkedRecordID(record, storageKey);

	    if (linkedID == null) {
	      return;
	    }
	    this._traverse(field, linkedID);
	  };

	  RelayReferenceMarker.prototype._traversePluralLink = function _traversePluralLink(field, record) {
	    var _this2 = this;

	    var storageKey = getStorageKey(field, this._variables);
	    var linkedIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);

	    if (linkedIDs == null) {
	      return;
	    }
	    linkedIDs.forEach(function (linkedID) {
	      if (linkedID != null) {
	        _this2._traverse(field, linkedID);
	      }
	    });
	  };

	  return RelayReferenceMarker;
	}();

	module.exports = { mark: mark };

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayResponseNormalizer
	 * 
	 */

	'use strict';

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	var _stringify2 = _interopRequireDefault(__webpack_require__(18));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var CONDITION = __webpack_require__(3).CONDITION,
	    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
	    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
	    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
	    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD,
	    SCALAR_HANDLE = __webpack_require__(3).SCALAR_HANDLE;

	var getArgumentValues = __webpack_require__(4).getArgumentValues,
	    getStorageKey = __webpack_require__(4).getStorageKey,
	    TYPENAME_KEY = __webpack_require__(4).TYPENAME_KEY;

	/**
	 * Normalizes the results of a query and standard GraphQL response, writing the
	 * normalized records/fields into the given MutableRecordSource.
	 *
	 * If handleStrippedNulls is true, will replace fields on the Selector that
	 * are not present in the response with null. Otherwise will leave fields unset.
	 */
	function normalize(recordSource, selector, response) {
	  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { handleStrippedNulls: false };
	  var dataID = selector.dataID,
	      node = selector.node,
	      variables = selector.variables;

	  var normalizer = new RelayResponseNormalizer(recordSource, variables, options);
	  return normalizer.normalizeResponse(node, dataID, response);
	}

	/**
	 * @private
	 *
	 * Helper for handling payloads.
	 */

	var RelayResponseNormalizer = function () {
	  function RelayResponseNormalizer(recordSource, variables, options) {
	    (0, _classCallCheck3['default'])(this, RelayResponseNormalizer);

	    this._handleFieldPayloads = [];
	    this._recordSource = recordSource;
	    this._variables = variables;
	    this._handleStrippedNulls = options.handleStrippedNulls;
	  }

	  RelayResponseNormalizer.prototype.normalizeResponse = function normalizeResponse(node, dataID, data) {
	    var record = this._recordSource.get(dataID);
	    __webpack_require__(1)(record, 'RelayResponseNormalizer(): Expected root record `%s` to exist.', dataID);
	    this._traverseSelections(node.selections, record, data);
	    return this._handleFieldPayloads;
	  };

	  RelayResponseNormalizer.prototype._getVariableValue = function _getVariableValue(name) {
	    __webpack_require__(1)(this._variables.hasOwnProperty(name), 'RelayResponseNormalizer(): Undefined variable `%s`.', name);
	    return this._variables[name];
	  };

	  RelayResponseNormalizer.prototype._getRecordType = function _getRecordType(data) {
	    var typeName = data[TYPENAME_KEY];
	    __webpack_require__(1)(typeName != null, 'RelayResponseNormalizer(): Expected a typename for record `%s`.', (0, _stringify2['default'])(data, null, 2));
	    return typeName;
	  };

	  RelayResponseNormalizer.prototype._traverseSelections = function _traverseSelections(selections, record, data) {
	    var _this = this;

	    selections.forEach(function (selection) {
	      if (selection.kind === SCALAR_FIELD || selection.kind === LINKED_FIELD) {
	        _this._normalizeField(selection, record, data);
	      } else if (selection.kind === CONDITION) {
	        var conditionValue = _this._getVariableValue(selection.condition);
	        if (conditionValue === selection.passingValue) {
	          _this._traverseSelections(selection.selections, record, data);
	        }
	      } else if (selection.kind === INLINE_FRAGMENT) {
	        var typeName = __webpack_require__(2).getType(record);
	        if (typeName === selection.type) {
	          _this._traverseSelections(selection.selections, record, data);
	        }
	      } else if (selection.kind === LINKED_HANDLE || selection.kind === SCALAR_HANDLE) {
	        var args = selection.args ? getArgumentValues(selection.args, _this._variables) : {};

	        var fieldKey = __webpack_require__(8)(selection.name, args);
	        var handleKey = __webpack_require__(45)(selection.handle, selection.key, selection.name);
	        if (selection.filters) {
	          var filterValues = __webpack_require__(4).getHandleFilterValues(selection.args || [], selection.filters, _this._variables);
	          handleKey = __webpack_require__(8)(handleKey, filterValues);
	        }
	        _this._handleFieldPayloads.push({
	          args: args,
	          dataID: __webpack_require__(2).getDataID(record),
	          fieldKey: fieldKey,
	          handle: selection.handle,
	          handleKey: handleKey
	        });
	      } else {
	        __webpack_require__(1)(false, 'RelayResponseNormalizer(): Unexpected ast kind `%s`.', selection.kind);
	      }
	    });
	  };

	  RelayResponseNormalizer.prototype._normalizeField = function _normalizeField(selection, record, data) {
	    __webpack_require__(1)(typeof data === 'object' && data, 'writeField(): Expected data for field `%s` to be an object.', selection.name);
	    var responseKey = selection.alias || selection.name;
	    var storageKey = getStorageKey(selection, this._variables);
	    var fieldValue = data[responseKey];
	    if (fieldValue == null) {
	      if (fieldValue === undefined && !this._handleStrippedNulls) {
	        // If we're not stripping nulls, undefined fields are unset
	        return;
	      }
	      if (true) {
	        __webpack_require__(23)(data.hasOwnProperty(responseKey), 'RelayResponseNormalizer(): Payload did not contain a value ' + 'for field `%s: %s`. Check that you are parsing with the same ' + 'query that was used to fetch the payload.', responseKey, storageKey);
	      }
	      __webpack_require__(2).setValue(record, storageKey, null);
	      return;
	    }

	    if (selection.kind === SCALAR_FIELD) {
	      __webpack_require__(2).setValue(record, storageKey, fieldValue);
	    } else if (selection.plural) {
	      this._normalizePluralLink(selection, record, storageKey, fieldValue);
	    } else {
	      this._normalizeLink(selection, record, storageKey, fieldValue);
	    }
	  };

	  RelayResponseNormalizer.prototype._normalizeLink = function _normalizeLink(field, record, storageKey, fieldValue) {
	    __webpack_require__(1)(typeof fieldValue === 'object' && fieldValue, 'RelayResponseNormalizer: Expected data for field `%s` to be an object.', storageKey);
	    var nextID = fieldValue.id ||
	    // Reuse previously generated client IDs
	    __webpack_require__(2).getLinkedRecordID(record, storageKey) || __webpack_require__(16)(__webpack_require__(2).getDataID(record), storageKey);
	    __webpack_require__(1)(typeof nextID === 'string', 'RelayResponseNormalizer: Expected id on field `%s` to be a string.', storageKey);
	    __webpack_require__(2).setLinkedRecordID(record, storageKey, nextID);
	    var nextRecord = this._recordSource.get(nextID);
	    if (!nextRecord) {
	      var typeName = field.concreteType || this._getRecordType(fieldValue);
	      nextRecord = __webpack_require__(2).create(nextID, typeName);
	      this._recordSource.set(nextID, nextRecord);
	    } else if (true) {
	      this._validateRecordType(nextRecord, field, fieldValue);
	    }
	    this._traverseSelections(field.selections, nextRecord, fieldValue);
	  };

	  RelayResponseNormalizer.prototype._normalizePluralLink = function _normalizePluralLink(field, record, storageKey, fieldValue) {
	    var _this2 = this;

	    __webpack_require__(1)(Array.isArray(fieldValue), 'RelayResponseNormalizer: Expected data for field `%s` to be an array ' + 'of objects.', storageKey);
	    var prevIDs = __webpack_require__(2).getLinkedRecordIDs(record, storageKey);
	    var nextIDs = [];
	    fieldValue.forEach(function (item, nextIndex) {
	      // validate response data
	      if (item == null) {
	        nextIDs.push(item);
	        return;
	      }
	      __webpack_require__(1)(typeof item === 'object', 'RelayResponseNormalizer: Expected elements for field `%s` to be ' + 'objects.', storageKey);

	      var nextID = item.id || prevIDs && prevIDs[nextIndex] || // Reuse previously generated client IDs
	      __webpack_require__(16)(__webpack_require__(2).getDataID(record), storageKey, nextIndex);
	      __webpack_require__(1)(typeof nextID === 'string', 'RelayResponseNormalizer: Expected id of elements of field `%s` to ' + 'be strings.', storageKey);

	      nextIDs.push(nextID);
	      var nextRecord = _this2._recordSource.get(nextID);
	      if (!nextRecord) {
	        var typeName = field.concreteType || _this2._getRecordType(item);
	        nextRecord = __webpack_require__(2).create(nextID, typeName);
	        _this2._recordSource.set(nextID, nextRecord);
	      } else if (true) {
	        _this2._validateRecordType(nextRecord, field, item);
	      }
	      _this2._traverseSelections(field.selections, nextRecord, item);
	    });
	    __webpack_require__(2).setLinkedRecordIDs(record, storageKey, nextIDs);
	  };

	  /**
	   * Warns if the type of the record does not match the type of the field/payload.
	   */


	  RelayResponseNormalizer.prototype._validateRecordType = function _validateRecordType(record, field, payload) {
	    var typeName = field.concreteType || this._getRecordType(payload);
	    __webpack_require__(23)(__webpack_require__(2).getType(record) === typeName, 'RelayResponseNormalizer: Invalid record `%s`. Expected %s to be ' + 'be consistent, but the record was assigned conflicting types ' + '`%s` and `%s`.', __webpack_require__(2).getDataID(record), TYPENAME_KEY, __webpack_require__(2).getType(record), typeName);
	  };

	  return RelayResponseNormalizer;
	}();

	// eslint-disable-next-line no-func-assign


	normalize = __webpack_require__(69).instrument('RelayResponseNormalizer.normalize', normalize);

	module.exports = { normalize: normalize };

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStaticFragmentSpecResolver
	 * 
	 */

	'use strict';

	var _extends3 = _interopRequireDefault(__webpack_require__(28));

	var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _require = __webpack_require__(72),
	    areEqualSelectors = _require.areEqualSelectors,
	    getSelectorsFromObject = _require.getSelectorsFromObject;

	/**
	 * A utility for resolving and subscribing to the results of a fragment spec
	 * (key -> fragment mapping) given some "props" that determine the root ID
	 * and variables to use when reading each fragment. When props are changed via
	 * `setProps()`, the resolver will update its results and subscriptions
	 * accordingly. Internally, the resolver:
	 * - Converts the fragment map & props map into a map of `Selector`s.
	 * - Removes any resolvers for any props that became null.
	 * - Creates resolvers for any props that became non-null.
	 * - Updates resolvers with the latest props.
	 *
	 * This utility is implemented as an imperative, stateful API for performance
	 * reasons: reusing previous resolvers, callback functions, and subscriptions
	 * all helps to reduce object allocation and thereby decrease GC time.
	 *
	 * The `resolve()` function is also lazy and memoized: changes in the store mark
	 * the resolver as stale and notify the caller, and the actual results are
	 * recomputed the first time `resolve()` is called.
	 */
	var RelayStaticFragmentSpecResolver = function () {
	  function RelayStaticFragmentSpecResolver(context, fragments, props, callback) {
	    var _this = this;

	    (0, _classCallCheck3['default'])(this, RelayStaticFragmentSpecResolver);

	    this._onChange = function () {
	      _this._stale = true;
	      _this._callback();
	    };

	    this._callback = callback;
	    this._context = context;
	    this._data = {};
	    this._fragments = fragments;
	    this._props = props;
	    this._resolvers = {};
	    this._stale = false;

	    this.setProps(props);
	  }

	  RelayStaticFragmentSpecResolver.prototype.dispose = function dispose() {
	    __webpack_require__(13)(this._resolvers, disposeCallback);
	  };

	  RelayStaticFragmentSpecResolver.prototype.resolve = function resolve() {
	    var _this2 = this;

	    if (this._stale) {
	      // Avoid mapping the object multiple times, which could occur if data for
	      // multiple keys changes in the same event loop.
	      var prevData = this._data;
	      var nextData = void 0;
	      __webpack_require__(13)(this._resolvers, function (resolver, key) {
	        var prevItem = prevData[key];
	        if (resolver) {
	          var nextItem = resolver.resolve();
	          if (nextData || nextItem !== prevItem) {
	            nextData = nextData || (0, _extends3['default'])({}, prevData);
	            nextData[key] = nextItem;
	          }
	        } else {
	          var prop = _this2._props[key];
	          var _nextItem = prop !== undefined ? prop : null;
	          if (nextData || !__webpack_require__(114)(_nextItem, prevItem)) {
	            nextData = nextData || (0, _extends3['default'])({}, prevData);
	            nextData[key] = _nextItem;
	          }
	        }
	      });
	      this._data = nextData || prevData;
	      this._stale = false;
	    }
	    return this._data;
	  };

	  RelayStaticFragmentSpecResolver.prototype.setProps = function setProps(props) {
	    var _this3 = this;

	    var selectors = getSelectorsFromObject(this._context.variables, this._fragments, props);
	    __webpack_require__(13)(selectors, function (selector, key) {
	      var resolver = _this3._resolvers[key];
	      if (selector == null) {
	        if (resolver != null) {
	          resolver.dispose();
	        }
	        resolver = null;
	      } else if (Array.isArray(selector)) {
	        if (resolver == null) {
	          resolver = new SelectorListResolver(_this3._context.environment, selector, _this3._onChange);
	        } else {
	          __webpack_require__(1)(resolver instanceof SelectorListResolver, 'RelayStaticFragmentSpecResolver: Expected prop `%s` to always be an array.', key);
	          resolver.setSelectors(selector);
	        }
	      } else {
	        if (resolver == null) {
	          resolver = new SelectorResolver(_this3._context.environment, selector, _this3._onChange);
	        } else {
	          __webpack_require__(1)(resolver instanceof SelectorResolver, 'RelayStaticFragmentSpecResolver: Expected prop `%s` to always be an object.', key);
	          resolver.setSelector(selector);
	        }
	      }
	      _this3._resolvers[key] = resolver;
	    });
	    this._props = props;
	    this._stale = true;
	  };

	  RelayStaticFragmentSpecResolver.prototype.setVariables = function setVariables(variables) {
	    __webpack_require__(13)(this._resolvers, function (resolver) {
	      if (resolver) {
	        resolver.setVariables(variables);
	      }
	    });
	    this._stale = true;
	  };

	  return RelayStaticFragmentSpecResolver;
	}();

	/**
	 * A resolver for a single Selector.
	 */


	var SelectorResolver = function () {
	  function SelectorResolver(environment, selector, callback) {
	    (0, _classCallCheck3['default'])(this, SelectorResolver);

	    _initialiseProps.call(this);

	    var snapshot = environment.lookup(selector);
	    this._callback = callback;
	    this._data = snapshot.data;
	    this._environment = environment;
	    this._selector = selector;
	    this._subscription = environment.subscribe(snapshot, this._onChange);
	  }

	  SelectorResolver.prototype.dispose = function dispose() {
	    if (this._subscription) {
	      this._subscription.dispose();
	      this._subscription = null;
	    }
	  };

	  SelectorResolver.prototype.resolve = function resolve() {
	    return this._data;
	  };

	  SelectorResolver.prototype.setSelector = function setSelector(selector) {
	    if (this._subscription != null && areEqualSelectors(selector, this._selector)) {
	      return;
	    }
	    this.dispose();
	    var snapshot = this._environment.lookup(selector);
	    this._data = snapshot.data;
	    this._selector = selector;
	    this._subscription = this._environment.subscribe(snapshot, this._onChange);
	  };

	  SelectorResolver.prototype.setVariables = function setVariables(variables) {
	    var selector = (0, _extends3['default'])({}, this._selector, {
	      variables: variables
	    });
	    this.setSelector(selector);
	  };

	  return SelectorResolver;
	}();

	/**
	 * A resolver for an array of Selectors.
	 */


	var _initialiseProps = function _initialiseProps() {
	  var _this5 = this;

	  this._onChange = function (snapshot) {
	    _this5._data = snapshot.data;
	    _this5._callback();
	  };
	};

	var SelectorListResolver = function () {
	  function SelectorListResolver(environment, selectors, callback) {
	    var _this4 = this;

	    (0, _classCallCheck3['default'])(this, SelectorListResolver);

	    this._onChange = function (data) {
	      _this4._stale = true;
	      _this4._callback();
	    };

	    this._callback = callback;
	    this._data = [];
	    this._environment = environment;
	    this._resolvers = [];
	    this._stale = true;

	    this.setSelectors(selectors);
	  }

	  SelectorListResolver.prototype.dispose = function dispose() {
	    this._resolvers.forEach(disposeCallback);
	  };

	  SelectorListResolver.prototype.resolve = function resolve() {
	    if (this._stale) {
	      // Avoid mapping the array multiple times, which could occur if data for
	      // multiple indices changes in the same event loop.
	      var prevData = this._data;
	      var nextData = void 0;
	      for (var ii = 0; ii < this._resolvers.length; ii++) {
	        var prevItem = prevData[ii];
	        var nextItem = this._resolvers[ii].resolve();
	        if (nextData || nextItem !== prevItem) {
	          nextData = nextData || prevData.slice(0, ii);
	          nextData.push(nextItem);
	        }
	      }
	      this._data = nextData || prevData;
	      this._stale = false;
	    }
	    return this._data;
	  };

	  SelectorListResolver.prototype.setSelectors = function setSelectors(selectors) {
	    while (this._resolvers.length > selectors.length) {
	      var resolver = this._resolvers.pop();
	      resolver.dispose();
	    }
	    for (var ii = 0; ii < selectors.length; ii++) {
	      if (ii < this._resolvers.length) {
	        this._resolvers[ii].setSelector(selectors[ii]);
	      } else {
	        this._resolvers[ii] = new SelectorResolver(this._environment, selectors[ii], this._onChange);
	      }
	    }
	    this._stale = true;
	  };

	  SelectorListResolver.prototype.setVariables = function setVariables(variables) {
	    this._resolvers.forEach(function (resolver) {
	      return resolver.setVariables(variables);
	    });
	    this._stale = true;
	  };

	  return SelectorListResolver;
	}();

	function disposeCallback(disposable) {
	  disposable && disposable.dispose();
	}

	module.exports = RelayStaticFragmentSpecResolver;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayStaticOperationSelector
	 * 
	 */

	'use strict';

	var _require = __webpack_require__(68),
	    getOperationVariables = _require.getOperationVariables;

	var _require2 = __webpack_require__(4),
	    ROOT_ID = _require2.ROOT_ID;

	/**
	 * Creates an instance of the `OperationSelector` type defined in
	 * `RelayStoreTypes` given an operation and some variables. The input variables
	 * are filtered to exclude variables that do not match defined arguments on the
	 * operation, and default values are populated for null values.
	 */
	function createOperationSelector(operation, variables) {
	  var operationVariables = getOperationVariables(operation, variables);
	  var dataID = ROOT_ID;
	  return {
	    fragment: {
	      dataID: dataID,
	      node: operation.fragment,
	      variables: operationVariables
	    },
	    node: operation,
	    root: {
	      dataID: dataID,
	      node: operation.query,
	      variables: operationVariables
	    },
	    variables: operationVariables
	  };
	}

	module.exports = {
	  createOperationSelector: createOperationSelector
	};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule RelayViewerHandler
	 * 
	 */

	'use strict';

	var _require = __webpack_require__(4),
	    ROOT_ID = _require.ROOT_ID;

	var VIEWER_ID = __webpack_require__(16)(ROOT_ID, 'viewer');
	var VIEWER_TYPE = 'Viewer';

	/**
	 * A runtime handler for the `viewer` field. The actual viewer record will
	 * *never* be accessed at runtime because all fragments that reference it will
	 * delegate to the handle field. So in order to prevent GC from having to check
	 * both the original server field *and* the handle field (which would be almost
	 * duplicate work), the handler copies server fields and then deletes the server
	 * record.
	 *
	 * NOTE: This means other handles may not be added on viewer, since they may
	 * execute after this handle when the server record is already deleted.
	 */
	function update(proxy, payload) {
	  var record = proxy.get(payload.dataID);
	  if (!record) {
	    return;
	  }
	  var serverViewer = record.getLinkedRecord(payload.fieldKey);
	  if (!serverViewer) {
	    record.setValue(null, payload.handleKey);
	    return;
	  }
	  // Server data already has viewer data at `client:root:viewer`, so link the
	  // handle field to the server viewer record.
	  if (serverViewer.getDataID() === VIEWER_ID) {
	    record.setValue(null, payload.fieldKey);
	    record.setLinkedRecord(serverViewer, payload.handleKey);
	    return;
	  }
	  // Other ways to access viewer such as mutations may have a different id for
	  // viewer: synthesize a record at the canonical viewer id, copy its fields
	  // from the server record, and delete the server record link to speed up GC.
	  var clientViewer = proxy.get(VIEWER_ID) || proxy.create(VIEWER_ID, VIEWER_TYPE);
	  clientViewer.copyFieldsFrom(serverViewer);
	  record.setValue(null, payload.fieldKey);
	  record.setLinkedRecord(clientViewer, payload.handleKey);

	  // Make sure the root object points to the viewer object as well
	  var root = proxy.getRoot();
	  root.setLinkedRecord(clientViewer, payload.handleKey);
	}

	module.exports = {
	  VIEWER_ID: VIEWER_ID,
	  update: update
	};

/***/ },
/* 110 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule commitLocalUpdate
	 * 
	 */

	'use strict';

	function commitLocalUpdate(environment, updater) {
	  environment.commitUpdate(updater);
	}

	module.exports = commitLocalUpdate;

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule commitRelayStaticMutation
	 * 
	 */

	'use strict';

	/**
	 * Higher-level helper function to execute a mutation against a specific
	 * environment.
	 */
	function commitRelayStaticMutation(environment, config) {
	  __webpack_require__(1)(__webpack_require__(74)(environment), 'commitRelayStaticMutation: expect `environment` to be an instance of ' + '`RelayStaticEnvironment`.');
	  var _environment$unstable = environment.unstable_internal,
	      createOperationSelector = _environment$unstable.createOperationSelector,
	      getOperation = _environment$unstable.getOperation;

	  var mutation = getOperation(config.mutation);
	  var onError = config.onError,
	      optimisticUpdater = config.optimisticUpdater,
	      updater = config.updater,
	      variables = config.variables,
	      uploadables = config.uploadables;

	  var operation = createOperationSelector(mutation, variables);
	  return environment.sendMutation({
	    onError: onError,
	    operation: operation,
	    optimisticUpdater: optimisticUpdater,
	    updater: updater,
	    uploadables: uploadables,
	    onCompleted: function onCompleted(errors) {
	      var onCompleted = config.onCompleted;

	      if (onCompleted) {
	        var snapshot = environment.lookup(operation.fragment);
	        onCompleted(snapshot.data, errors);
	      }
	    }
	  });
	}

	module.exports = commitRelayStaticMutation;

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule fetchRelayStaticQuery
	 * 
	 */

	'use strict';

	var _promise2 = _interopRequireDefault(__webpack_require__(93));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	/**
	 * A helper function to fetch the results of a query. Note that results for
	 * fragment spreads are masked: fields must be explicitly listed in the query in
	 * order to be accessible in the result object.
	 *
	 * NOTE: This module is primarily intended for integrating with classic APIs.
	 * Most product code should use a Renderer or Container.
	 *
	 * TODO(t16875667): The return type should be `Promise<?SelectorData>`, but
	 * that's not really helpful as `SelectorData` is essentially just `mixed`. We
	 * can probably leverage generated flow types here to return the real expected
	 * shape.
	 */
	function fetchRelayStaticQuery(environment, taggedNode, variables, cacheConfig) {
	  __webpack_require__(1)(environment.unstable_internal, 'fetchRelayStaticQuery: Expected a valid Relay environment, got `%s`.', environment);
	  var _environment$unstable = environment.unstable_internal,
	      createOperationSelector = _environment$unstable.createOperationSelector,
	      getOperation = _environment$unstable.getOperation;

	  var query = getOperation(taggedNode);
	  var operation = createOperationSelector(query, variables);
	  return new _promise2['default'](function (resolve, reject) {
	    environment.sendQuery({
	      cacheConfig: cacheConfig,
	      onError: reject,
	      onCompleted: function onCompleted() {
	        try {
	          var snapshot = environment.lookup(operation.fragment);
	          resolve(snapshot.data);
	        } catch (e) {
	          reject(e);
	        }
	      },

	      operation: operation
	    });
	  });
	}

	module.exports = fetchRelayStaticQuery;

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule hasOverlappingIDs
	 * 
	 */

	'use strict';

	var _keys2 = _interopRequireDefault(__webpack_require__(27));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function hasOverlappingIDs(snapshot, updatedRecordIDs) {
	  var keys = (0, _keys2['default'])(snapshot.seenRecords);
	  for (var ii = 0; ii < keys.length; ii++) {
	    if (updatedRecordIDs.hasOwnProperty(keys[ii])) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = hasOverlappingIDs;

/***/ },
/* 114 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 * @providesModule isScalarAndEqual
	 */

	'use strict';

	/**
	 * A fast test to determine if two values are equal scalars:
	 * - compares scalars such as booleans, strings, numbers by value
	 * - compares functions by identity
	 * - returns false for complex values, since these cannot be cheaply tested for
	 *   equality (use `areEquals` instead)
	 */

	function isScalarAndEqual(valueA, valueB) {
	  return valueA === valueB && (valueA === null || typeof valueA !== 'object');
	}

	module.exports = isScalarAndEqual;

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule recycleNodesInto
	 * 
	 */

	'use strict';

	/**
	 * Recycles subtrees from `prevData` by replacing equal subtrees in `nextData`.
	 */

	var _keys2 = _interopRequireDefault(__webpack_require__(27));

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function recycleNodesInto(prevData, nextData) {
	  if (prevData === nextData || typeof prevData !== 'object' || !prevData || typeof nextData !== 'object' || !nextData) {
	    return nextData;
	  }
	  var canRecycle = false;

	  // Assign local variables to preserve Flow type refinement.
	  var prevArray = Array.isArray(prevData) ? prevData : null;
	  var nextArray = Array.isArray(nextData) ? nextData : null;
	  if (prevArray && nextArray) {
	    canRecycle = nextArray.reduce(function (wasEqual, nextItem, ii) {
	      var prevValue = prevArray[ii];
	      var nextValue = recycleNodesInto(prevValue, nextItem);
	      if (nextValue !== nextArray[ii]) {
	        nextArray[ii] = nextValue;
	      }
	      return wasEqual && nextArray[ii] === prevArray[ii];
	    }, true) && prevArray.length === nextArray.length;
	  } else if (!prevArray && !nextArray) {
	    // Assign local variables to preserve Flow type refinement.
	    var prevObject = prevData;
	    var nextObject = nextData;
	    var prevKeys = (0, _keys2['default'])(prevObject);
	    var nextKeys = (0, _keys2['default'])(nextObject);
	    canRecycle = nextKeys.reduce(function (wasEqual, key) {
	      var prevValue = prevObject[key];
	      var nextValue = recycleNodesInto(prevValue, nextObject[key]);
	      if (nextValue !== nextObject[key]) {
	        nextObject[key] = nextValue;
	      }
	      return wasEqual && nextObject[key] === prevObject[key];
	    }, true) && prevKeys.length === nextKeys.length;
	  }
	  return canRecycle ? prevData : nextData;
	}

	module.exports = recycleNodesInto;

/***/ },
/* 116 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule requestRelaySubscription
	 * 
	 */

	'use strict';

	function requestRelaySubscription(environment, config) {
	  var _environment$unstable = environment.unstable_internal,
	      createOperationSelector = _environment$unstable.createOperationSelector,
	      getOperation = _environment$unstable.getOperation;

	  var subscription = getOperation(config.subscription);
	  var onCompleted = config.onCompleted,
	      onError = config.onError,
	      onNext = config.onNext,
	      updater = config.updater,
	      variables = config.variables;

	  var operation = createOperationSelector(subscription, variables);
	  return environment.sendSubscription({
	    onCompleted: onCompleted,
	    onError: onError,
	    onNext: function (_onNext) {
	      function onNext(_x) {
	        return _onNext.apply(this, arguments);
	      }

	      onNext.toString = function () {
	        return _onNext.toString();
	      };

	      return onNext;
	    }(function (payload) {
	      if (onNext) {
	        var snapshot = environment.lookup(operation.fragment);
	        onNext(snapshot.data);
	      }
	    }),

	    updater: updater,
	    operation: operation
	  });
	}

	module.exports = requestRelaySubscription;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(129), __esModule: true };

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(131), __esModule: true };

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(132), __esModule: true };

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(134), __esModule: true };

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(135), __esModule: true };

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(137), __esModule: true };

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(139), __esModule: true };

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(140), __esModule: true };

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(119);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(122);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(118);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(77);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(77);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(5)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	__webpack_require__(64);
	__webpack_require__(65);
	__webpack_require__(163);
	__webpack_require__(174);
	module.exports = __webpack_require__(5).Map;

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(164);
	module.exports = __webpack_require__(5).Object.assign;

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(165);
	var $Object = __webpack_require__(5).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(166);
	var $Object = __webpack_require__(5).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(167);
	module.exports = __webpack_require__(5).Object.freeze;

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(168);
	var $Object = __webpack_require__(5).Object;
	module.exports = function getOwnPropertyNames(it){
	  return $Object.getOwnPropertyNames(it);
	};

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(169);
	module.exports = __webpack_require__(5).Object.isFrozen;

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(170);
	module.exports = __webpack_require__(5).Object.keys;

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(171);
	module.exports = __webpack_require__(5).Object.setPrototypeOf;

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	__webpack_require__(64);
	__webpack_require__(65);
	__webpack_require__(172);
	__webpack_require__(175);
	module.exports = __webpack_require__(5).Set;

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(173);
	__webpack_require__(63);
	__webpack_require__(176);
	__webpack_require__(177);
	module.exports = __webpack_require__(5).Symbol;

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(64);
	__webpack_require__(65);
	module.exports = __webpack_require__(62).f('iterator');

/***/ },
/* 141 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 142 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	var forOf = __webpack_require__(51);

	module.exports = function(iter, ITERATOR){
	  var result = [];
	  forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(22)
	  , toLength  = __webpack_require__(59)
	  , toIndex   = __webpack_require__(160);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx      = __webpack_require__(29)
	  , IObject  = __webpack_require__(52)
	  , toObject = __webpack_require__(39)
	  , toLength = __webpack_require__(59)
	  , asc      = __webpack_require__(147);
	module.exports = function(TYPE, $create){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
	    , create        = $create || asc;
	  return function($this, callbackfn, that){
	    var O      = toObject($this)
	      , self   = IObject(O)
	      , f      = ctx(callbackfn, that, 3)
	      , length = toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(15)
	  , isArray  = __webpack_require__(85)
	  , SPECIES  = __webpack_require__(7)('species');

	module.exports = function(original){
	  var C;
	  if(isArray(original)){
	    C = original.constructor;
	    // cross-realm fallback
	    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
	    if(isObject(C)){
	      C = C[SPECIES];
	      if(C === null)C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = __webpack_require__(146);

	module.exports = function(original, length){
	  return new (speciesConstructor(original))(length);
	};

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(25)
	  , gOPS    = __webpack_require__(55)
	  , pIE     = __webpack_require__(35);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11).document && document.documentElement;

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(30)
	  , ITERATOR   = __webpack_require__(7)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(19);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(34)
	  , descriptor     = __webpack_require__(37)
	  , setToStringTag = __webpack_require__(38)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(17)(IteratorPrototype, __webpack_require__(7)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(25)
	  , toIObject = __webpack_require__(22);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(25)
	  , gOPS     = __webpack_require__(55)
	  , pIE      = __webpack_require__(35)
	  , toObject = __webpack_require__(39)
	  , IObject  = __webpack_require__(52)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(20)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(12)
	  , anObject = __webpack_require__(19)
	  , getKeys  = __webpack_require__(25);

	module.exports = __webpack_require__(9) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(21)
	  , toObject    = __webpack_require__(39)
	  , IE_PROTO    = __webpack_require__(56)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(15)
	  , anObject = __webpack_require__(19);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(29)(Function.call, __webpack_require__(87).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(11)
	  , core        = __webpack_require__(5)
	  , dP          = __webpack_require__(12)
	  , DESCRIPTORS = __webpack_require__(9)
	  , SPECIES     = __webpack_require__(7)('species');

	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(58)
	  , defined   = __webpack_require__(32);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(58)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(79)
	  , ITERATOR  = __webpack_require__(7)('iterator')
	  , Iterators = __webpack_require__(30);
	module.exports = __webpack_require__(5).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(142)
	  , step             = __webpack_require__(86)
	  , Iterators        = __webpack_require__(30)
	  , toIObject        = __webpack_require__(22);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(53)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(80);

	// 23.1 Map Objects
	module.exports = __webpack_require__(82)('Map', function(get){
	  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(10);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(154)});

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(34)});

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(9), 'Object', {defineProperty: __webpack_require__(12).f});

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(15)
	  , meta     = __webpack_require__(33).onFreeze;

	__webpack_require__(36)('freeze', function($freeze){
	  return function freeze(it){
	    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
	  };
	});

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 Object.getOwnPropertyNames(O)
	__webpack_require__(36)('getOwnPropertyNames', function(){
	  return __webpack_require__(88).f;
	});

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.12 Object.isFrozen(O)
	var isObject = __webpack_require__(15);

	__webpack_require__(36)('isFrozen', function($isFrozen){
	  return function isFrozen(it){
	    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
	  };
	});

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(39)
	  , $keys    = __webpack_require__(25);

	__webpack_require__(36)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(10);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(157).set});

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(80);

	// 23.2 Set Objects
	module.exports = __webpack_require__(82)('Set', function(get){
	  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(11)
	  , has            = __webpack_require__(21)
	  , DESCRIPTORS    = __webpack_require__(9)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(92)
	  , META           = __webpack_require__(33).KEY
	  , $fails         = __webpack_require__(20)
	  , shared         = __webpack_require__(57)
	  , setToStringTag = __webpack_require__(38)
	  , uid            = __webpack_require__(40)
	  , wks            = __webpack_require__(7)
	  , wksExt         = __webpack_require__(62)
	  , wksDefine      = __webpack_require__(61)
	  , keyOf          = __webpack_require__(153)
	  , enumKeys       = __webpack_require__(148)
	  , isArray        = __webpack_require__(85)
	  , anObject       = __webpack_require__(19)
	  , toIObject      = __webpack_require__(22)
	  , toPrimitive    = __webpack_require__(60)
	  , createDesc     = __webpack_require__(37)
	  , _create        = __webpack_require__(34)
	  , gOPNExt        = __webpack_require__(88)
	  , $GOPD          = __webpack_require__(87)
	  , $DP            = __webpack_require__(12)
	  , $keys          = __webpack_require__(25)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(89).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(35).f  = $propertyIsEnumerable;
	  __webpack_require__(55).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(54)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(17)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(10);

	$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(81)('Map')});

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export  = __webpack_require__(10);

	$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(81)('Set')});

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61)('asyncIterator');

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61)('observable');

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Promise = __webpack_require__(93);

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * 
	 */

	var resolvedPromise = Promise.resolve();

	/**
	 * An alternative to setImmediate based on Promise.
	 */
	function resolveImmediate(callback) {
	  resolvedPromise.then(callback)["catch"](throwNext);
	}

	function throwNext(error) {
	  setTimeout(function () {
	    throw error;
	  }, 0);
	}

	module.exports = resolveImmediate;

/***/ },
/* 179 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 */

	/**
	 * Simple function for formatting strings.
	 *
	 * Replaces placeholders with values passed as extra arguments
	 *
	 * @param {string} format the base string
	 * @param ...args the values to insert
	 * @return {string} the replaced string
	 */
	function sprintf(format) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  var index = 0;
	  return format.replace(/%s/g, function (match) {
	    return args[index++];
	  });
	}

	module.exports = sprintf;

/***/ },
/* 180 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_180__;

/***/ }
/******/ ])
});
;