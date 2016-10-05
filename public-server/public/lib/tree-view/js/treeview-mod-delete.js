(function (angular) {
	'use strict';

	angular.module('angularTreeview', []).directive('treeModel', ['$compile', function ($compile) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				//tree id
				var treeId = attrs.treeId;

				//tree model
				var treeModel = attrs.treeModel;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node name
				var nodeLabel = attrs.nodeLabel || 'label';

				var selectFunction = 'scope.'+attrs.nodeSelectFunction || '$scope.select';

				//children
				var nodeChildren = attrs.nodeChildren || 'children';

				//tree template
				var template =
					'<ul>' +
					'<li data-ng-repeat="node in ' + treeModel + '">' +
					'<div class="row"><div class="col-md-10">' +
					/*'<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
					'<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +*/
					'<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length || node.' + nodeId + '.slice(-1) == ' + "'/'" + '" data-ng-click="' + treeId + '.selectnodeLabel(node)"></i>' +
					/*'<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" ></i>' +*/
					'<i class="normal" data-ng-hide="node.' + nodeChildren + '.length || node.' + nodeId + '.slice(-1) == ' + "'/'" + '"></i> ' +
					'<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectnodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
					'</div><div class="col-md-2">' +
					'<button type="button" class="btn btn-danger btn-xs pull-right clearfix" aria-label="Left Align" data-ng-click="' + treeId + '.deleteNode(node)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>' +
					'</div></div>' +
					//'<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-name=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
					'</li>' +
					'</ul>';


				//check tree id, tree model
				if (treeId && treeModel) {

					//root node
					if (attrs.angularTreeview) {

						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};
						/*
														//if node head clicks,
														scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function(selectedNode) {

															 //Collapse or Expand
															 selectedNode.collapsed = !selectedNode.collapsed;
														};
						*/
						//if node name clicks,
						scope[treeId].selectnodeLabel = scope[treeId].selectnodeLabel || function (selectedNode) {

							//remove highlight from previous node
							if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
								scope[treeId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[treeId].currentNode = selectedNode;
							eval(selectFunction)(scope[treeId].currentNode);
						};

						scope[treeId].deleteNode = scope[treeId].deleteNode || function (node) {
							console.log("Node to delete: ");
							console.log(node);
						};
					}

					//Rendering template.
					element.html('').append($compile(template)(scope));
				}
			}
		};
	}]);
})(angular);