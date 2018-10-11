/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, quotes: 0*/
"use strict";
var express = require("express");
var async = require("async");
var et = require('elementtree');
var XML = et.XML;
var ElementTree = et.ElementTree;
var element = et.Element;
var subElement = et.SubElement;

function getLocale(req) {
	var langparser = require("accept-language-parser");
	var lang = req.headers["accept-language"];
	if (!lang) {
		return 'EN';
	}
	var arr = langparser.parse(lang);
	if (!arr || arr.length < 1) {
		return 'EN';
	}
	var locale = arr[0].code;
	return locale.toUpperCase();
}

function getValueByKey(key, value, data) {
	for (var i = 0; i < data.length; i++) {
		if (data[i] && data[i].hasOwnProperty(key)) {
			if (data[i][key] === value) {
				return data[i];
			}
		}
	}
}

function buildXMLHeader() {
	var Edmx = element('edmx:Edmx');
	Edmx.set('xmlns:edmx', 'http://schemas.microsoft.com/ado/2007/06/edmx');
	Edmx.set('xmlns:m', 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata');
	Edmx.set('xmlns:sap', 'http://www.sap.com/Protocols/SAPData');
	Edmx.set('Version', '1.0');

	var DataServices = subElement(Edmx, 'edmx:DataServices');
	DataServices.set('m:DataServiceVersion', '2.0');

	var Schema = subElement(DataServices, 'Schema');
	Schema.set('xmlns:d', 'http://schemas.microsoft.com/ado/2007/08/dataservice');
	Schema.set('xmlns:m', 'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata');
	Schema.set('xmlns', 'http://schemas.microsoft.com/ado/2008/09/edm');
	Schema.set('Namespace', 'com.sap.openSAP.hana.example.services');

	return {
		root: Edmx,
		schema: Schema
	};
}

function buildAnnotationTarget(xml, target) {
	xml.annotationTarget = subElement(xml.schema, 'Annotations');
	xml.annotationTarget.set('xmlns', 'http://docs.oasis-open.org/odata/ns/edm');
	xml.annotationTarget.set('Target', target);
}

function buildLineItem(xml, cdsAnnotationValues) {
	xml.lineItem = subElement(xml.annotationTarget, 'Annotation');
	xml.lineItem.set('Term', 'com.sap.vocabularies.UI.v1.LineItem');
	var collection = subElement(xml.lineItem, 'Collection');

	async.each(cdsAnnotationValues, function(cdsAnnotationValue, callback) {
		if (typeof cdsAnnotationValue.lineItem !== 'undefined') {
			var record = subElement(collection, 'Record');
			record.set('Type', 'com.sap.vocabularies.UI.v1.DataField');

			var propertyValue = subElement(record, 'PropertyValue');
			propertyValue.set('Property', 'Value');
			propertyValue.set('Path', cdsAnnotationValue.ELEMENT_NAME);

			if (typeof cdsAnnotationValue.Label !== 'undefined') {
				var label = subElement(record, 'PropertyValue');
				label.set('Property', 'Label');
				label.set('String', cdsAnnotationValue.Label);
			}

			if (typeof cdsAnnotationValue.quickInfo !== 'undefined') {
				var quick = subElement(record, 'PropertyValue');
				quick.set('Property', 'QuickInfo');
				quick.set('String', cdsAnnotationValue.quickInfo);
			}

			var importance = subElement(record, 'Annotation');
			importance.set('Term', 'com.sap.vocabularies.UI.v1.Importance');
			if (typeof cdsAnnotationValue.lineItem.importance !== 'undefined') {
				importance.set('EnumMember', 'com.sap.vocabularies.UI.v1.ImportanceType/' + cdsAnnotationValue.lineItem.importance);
			} else {
				importance.set('EnumMember', ' ');
			}

			if (typeof cdsAnnotationValue.lineItem.position !== 'undefined') {
				var position = subElement(record, 'PropertyValue');
				position.set('Property', 'Position');
				position.set('String', cdsAnnotationValue.lineItem.position);
			}
		}
		callback();
	}, function(err) {

	});
}

function buildValueList(xml, cdsAnnotationValues, target) {

	async.each(cdsAnnotationValues, function(cdsAnnotationValue, callback) {
		if (typeof cdsAnnotationValue.valueList !== 'undefined') {

			var annotations = subElement(xml.schema, 'Annotations');
			annotations.set('xmlns', 'http://docs.oasis-open.org/odata/ns/edm');
			annotations.set('Target', target + '/' + cdsAnnotationValue.ELEMENT_NAME);

			var annotation = subElement(annotations, 'Annotation');
			annotation.set('Term', 'com.sap.vocabularies.Common.v1.ValueList');

			var record = subElement(annotation, 'Record');

			var collectionPath = subElement(record, 'PropertyValue');
			collectionPath.set('Property', 'CollectionPath');
			collectionPath.set('String', cdsAnnotationValue.valueList.collectionPath);

			if (typeof cdsAnnotationValue.valueList.searchSupported !== 'undefined') {
				var searchSupported = subElement(record, 'PropertyValue');
				searchSupported.set('Property', 'SearchSupported');
				searchSupported.set('Bool', cdsAnnotationValue.valueList.searchSupported);
			}

			var parameters = subElement(record, 'PropertyValue');
			parameters.set('Property', 'Parameters');

			var collection = subElement(parameters, 'Collection');

			async.each(cdsAnnotationValue.valueList.parameterInOut, function(parameterInOut, callback) {
				var recordInOut = subElement(collection, 'Record');
				recordInOut.set('Type', 'com.sap.vocabularies.Common.v1.ValueListParameterInOut');
				if (typeof parameterInOut.localDataProperty !== 'undefined') {
					var localDataProperty = subElement(recordInOut, 'PropertyValue');
					localDataProperty.set('Property', 'LocalDataProperty');
					localDataProperty.set('PropertyPath', parameterInOut.localDataProperty);
				}
				if (typeof parameterInOut.valueListProperty !== 'undefined') {
					var valueListProperty = subElement(recordInOut, 'PropertyValue');
					valueListProperty.set('Property', 'ValueListProperty');
					valueListProperty.set('String', parameterInOut.valueListProperty);
				}

				if (typeof parameterInOut.label !== 'undefined') {
					var label = subElement(recordInOut, 'PropertyValue');
					label.set('Property', 'Label');
					label.set('String', parameterInOut.label);
				}
				callback();
			}, function(err) {

			});

			if (typeof cdsAnnotationValue.valueList.parameterDisplayOnly !== 'undefined') {
				for (var pi2 = 0; pi2 < cdsAnnotationValue.valueList.parameterDisplayOnly.length; pi2++) {
					var recordDisplayOnly = subElement(collection, 'Record');
					recordDisplayOnly.set('Type', 'com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly');
					if (typeof cdsAnnotationValue.valueList.parameterDisplayOnly[pi2].valueListProperty !== 'undefined') {
						var valueListProperty2 = subElement(recordDisplayOnly, 'PropertyValue');
						valueListProperty2.set('Property', 'ValueListProperty');
						valueListProperty2.set('String', cdsAnnotationValue.valueList.parameterDisplayOnly[pi2].valueListProperty);
					}
					if (typeof cdsAnnotationValue.valueList.parameterDisplayOnly[pi2].label !== 'undefined') {
						var label2 = subElement(recordDisplayOnly, 'PropertyValue');
						label2.set('Property', 'Label');
						label2.set('String', cdsAnnotationValue.valueList.parameterDisplayOnly[pi2].label);
					}
				}
			}
		}
		callback();
	}, function(err) {

	});
}

function buildFieldGroup(xml, cdsAnnotationValues) {
	xml.fieldGroup = subElement(xml.annotationTarget, 'Annotation');
	xml.fieldGroup.set('Term', 'com.sap.vocabularies.UI.v1.FieldGroup');
	xml.fieldGroup.set('Qualifier', 'Primary');
	var record = subElement(xml.fieldGroup, 'Record');

	var filterLabel = subElement(record, 'PropertyValue');
	filterLabel.set('Property', 'Label');
	filterLabel.set('String', 'Primary');

	var filterData = subElement(record, 'PropertyValue');
	filterData.set('Property', 'Data');

	var collection = subElement(filterData, 'Collection');
	async.each(cdsAnnotationValues, function(cdsAnnotationValue, callback) {
		if (typeof cdsAnnotationValue.fieldGroup !== 'undefined') {
			var recordInner = subElement(collection, 'Record');
			recordInner.set('Type', 'com.sap.vocabularies.UI.v1.DataField');

			var propertyValue = subElement(recordInner, 'PropertyValue');
			propertyValue.set('Property', 'Value');
			propertyValue.set('Path', cdsAnnotationValue.ELEMENT_NAME);

			if (typeof cdsAnnotationValue.Label !== 'undefined') {
				var label = subElement(recordInner, 'PropertyValue');
				label.set('Property', 'Label');
				label.set('String', cdsAnnotationValue.Label);
			}

			if (typeof cdsAnnotationValue.quickInfo !== 'undefined') {
				var quick = subElement(recordInner, 'PropertyValue');
				quick.set('Property', 'QuickInfo');
				quick.set('String', cdsAnnotationValue.quickInfo);
			}
			if (typeof cdsAnnotationValue.fieldGroup.importance !== 'undefined') {
				var importance = subElement(recordInner, 'Annotation');
				importance.set('Term', 'com.sap.vocabularies.UI.v1.Importance');
				importance.set('EnumMember', 'com.sap.vocabularies.UI.v1.ImportanceType/' + cdsAnnotationValue.lineItem.importance);
			}

			if (typeof cdsAnnotationValue.fieldGroup.position !== 'undefined') {
				var position = subElement(recordInner, 'PropertyValue');
				position.set('Property', 'Position');
				position.set('Integer', cdsAnnotationValue.fieldGroup.position);
			}

			if (typeof cdsAnnotationValue.fieldGroup.exclude !== 'undefined') {
				var exclude = subElement(recordInner, 'PropertyValue');
				exclude.set('Property', 'Exclude');
				exclude.set('Boolean', cdsAnnotationValue.fieldGroup.exclude);
			}
		}
		callback();
	}, function(err) {

	});
}

function flattenCDSAnnotationVaules(results, locale) {
	var cdsAnnotationValues = [];
	async.each(results, function(result, callback) {
		if (!getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues)) {
			cdsAnnotationValues.push({
				ELEMENT_NAME: result.ELEMENT_NAME
			});
		}
		callback();
	}, function(err) {
		async.each(results, function(result, callback) {
			var value = '';
			var temp = '';
			if (result.ANNOTATION_NAME === "annotations.EndUserText") {
				value = JSON.parse(result.VALUE);

				if (typeof value.value.label !== 'undefined') {
					temp = getValueByKey('language', locale, value.value.label);
					if (temp) {
						getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).Label = temp.text;
					} else {
						temp = getValueByKey('language', 'EN', value.value.label);
						if (temp) {
							getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).Label = temp.text;
						}
					}
				}

				if (typeof value.value.quickInfo !== 'undefined') {
					temp = getValueByKey('language', locale, value.value.quickInfo);
					if (temp) {
						getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).quickInfo = temp.text;
					} else {
						temp = getValueByKey('language', 'EN', value.value.quickInfo);
						if (temp) {
							getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).quickInfo = temp.text;
						}
					}
				}
			}

			if (result.ANNOTATION_NAME === "annotations.UI") {
				value = JSON.parse(result.VALUE);
				if (typeof value.value.fieldGroup !== 'undefined') {
					getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).fieldGroup = value.value.fieldGroup[0];
				}
				if (typeof value.value.lineItem !== 'undefined') {
					getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).lineItem = value.value.lineItem[0];
				}

			}

			if (result.ANNOTATION_NAME === "sap.common::UI") {
				value = JSON.parse(result.VALUE);
				if (typeof value.value.fieldGroup !== 'undefined') {
					getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).fieldGroup = value.value.fieldGroup[0];
				}
				if (typeof value.value.lineItem !== 'undefined') {
					getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).lineItem = value.value.lineItem[0];
				}

			}

			if (result.ANNOTATION_NAME === "UI.fieldGroup") {
				value = JSON.parse(result.VALUE);
				getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).fieldGroup = value.value;
			}

			if (result.ANNOTATION_NAME === "UI.lineItem") {
				value = JSON.parse(result.VALUE);
				getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).lineItem = value.value;
			}

			if (result.ANNOTATION_NAME === "annotations.valueList") {
				value = JSON.parse(result.VALUE);
				getValueByKey('ELEMENT_NAME', result.ELEMENT_NAME, cdsAnnotationValues).valueList = value.value;
			}
			callback();
		}, function(err) {

		});
	});
	return cdsAnnotationValues;
}

function buildAnnotationXML(res, results, target, req) {
	var locale = getLocale(req);
	var xmlOut = "";
	var xml = buildXMLHeader();
	buildAnnotationTarget(xml, target);
	var cdsAnnotationValues = flattenCDSAnnotationVaules(results, locale);
	buildValueList(xml, cdsAnnotationValues, target);
	buildLineItem(xml, cdsAnnotationValues);
	buildFieldGroup(xml, cdsAnnotationValues);

	var etree = new ElementTree(xml.root);
	xmlOut = etree.write({
		'xml_declaration': true
	});
	res.type("application/xml").status(200).send(xmlOut);
	return;

}

module.exports = function() {
	var app = express.Router();
	var bodyParser = require("body-parser");
	app.use(bodyParser.json());

	app.get("/:target/:artifact", function(req, res) {
		var target = req.params.target;
		var artifact = req.params.artifact;

		var client = req.db;
		/*		var insertString = "SELECT * from CDS_ANNOTATION_VALUES " +
					" WHERE SCHEMA_NAME = CURRENT_SCHEMA AND ARTIFACT_NAME = ? ORDER BY ELEMENT_NAME ";*/

		var insertString = "SELECT A.*, B.POSITION from CDS_ANNOTATION_VALUES A " +
			" left outer join view_columns B on A.SCHEMA_NAME = B.SCHEMA_NAME and A.ARTIFACT_NAME = B.VIEW_NAME and A.ELEMENT_NAME = B.COLUMN_NAME" +
			" WHERE A.SCHEMA_NAME = CURRENT_SCHEMA AND A.ARTIFACT_NAME = ? ORDER BY B.POSITION ";

		client.prepare(
			insertString,
			function(err, statement) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				}
				statement.exec([artifact],
					function(err, results) {
						if (err) {
							res.type("text/plain").status(500).send("ERROR: " + err.toString());
							return;
						} else {
							buildAnnotationXML(res, results, target, req);
							return;
						}
					});
			});

	});

	return app;
};