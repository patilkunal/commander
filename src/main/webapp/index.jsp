<html>
<head>
<title>Test Commander</title>
<link type="text/css" rel="stylesheet" href="assets/css/app.css">
<link type="text/css" rel="stylesheet" href="assets/css/jquery-ui.css">
<link rel="stylesheet" type="text/css" href="assets/css/ui.jqgrid.css" />
<link rel="stylesheet" type="text/css" href="assets/css/jquery.jqplot.css" />
<link type="text/css" rel="stylesheet" href="assets/css/bootstrap.css">
<link type="text/css" rel="stylesheet" href="assets/css/bootstrap-theme.css">

<script type="text/javascript" src="assets/js/jquery/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="assets/js/jquery/jquery-ui.js"></script>
<script type="text/javascript" src="assets/js/jquery/jquery.jqGrid.src.js" charset="utf-8"></script>
<script type="text/javascript" src="assets/js/jquery/jquery.jqplot.min.js"></script>
<script type="text/javascript" src="assets/js/jquery/jqplot.pieRenderer.js"></script>
<script type="text/javascript" src="assets/js/jquery/jqplot.barRenderer.min.js"></script>
<script type="text/javascript" src="assets/js/jquery/jqplot.categoryAxisRenderer.min.js"></script>
<script type="text/javascript" src="assets/js/jquery/jqplot.pointLabels.min.js"></script>

<script type="text/javascript" src="assets/js/bootstrap/bootstrap.js"></script>
<script type="text/javascript" src="assets/js/angular/angular.js"></script>
<script type="text/javascript" src="assets/js/angular/angular-route.js"></script>
<script type="text/javascript" src="assets/js/angular/angular-resource.js"></script>
<script type="text/javascript" src="assets/js/angular/ui-bootstrap-tpls-0.11.2.js"></script>
<script type="text/javascript" src="assets/js/underscore/underscore.js"></script>
<script type="text/javascript" src="assets/js/thirdparty/d3.v3.min.js"></script>

<script type="text/javascript" src="assets/js/project/app.js"></script>
<script type="text/javascript" src="assets/js/project/services.js"></script>
<script type="text/javascript" src="assets/js/project/directives.js"></script>

<script type="text/javascript" src="assets/js/project/home.js"></script>
<script type="text/javascript" src="assets/js/project/batchtest.js"></script>
<script type="text/javascript" src="assets/js/project/runtest.js"></script>
<script type="text/javascript" src="assets/js/project/definetests.js"></script>
<script type="text/javascript" src="assets/js/project/hosts.js"></script>
<script type="text/javascript" src="assets/js/project/schedules.js"></script>

</head>
<body ng-app="app">

<div class="container" role="main">

    <div class="navbar navbar-default navbar-static-top" role="navigation" ng-controller="MenuController">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Test Commander</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li ng-class="getClass('/home')"><a href="#/home">Home</a></li>
            <li ng-class="getClass('/runtest')"><a href="#/runtest">Run Tests</a></li>
            <li ng-class="getClass('/definetest')"><a href="#/definetest">Define Tests</a></li>
            <li ng-class="getClass('/host')"><a href="#/host">Hosts</a></li>
            <li ng-class="getClass('/schedules')"><a href="#/schedules">Schedules</a></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div ng-controller="MessageServiceController">
	<div class="alert alert-danger alert-dismissible" role="alert" ng-if="errorMessage != null">
	  <button type="button" class="close" ng-click="hideerror()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
	  <strong>Error!</strong> {{errorMessage}}
	</div>
	
	<div class="alert alert-success alert-dismissible" role="alert" ng-if="infoMessage != null">
		<!-- data-dismiss="alert" -->
	  <button type="button" class="close" ng-click="hideinfo()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
	  {{infoMessage}}
	</div>
	</div>

	<div data-ng-view>
	</div>


</div>

<script type="text/ng-template" id="progressModal.html">
<div class="modal-header">
            <h3 class="modal-title">Please wait</h3>
</div>
<div class="modal-body">
<span ng-show="message"> {{message}} </span>
<span ng-hide="message">Loading data ...</span>
</div>
</script>

<script type="text/ng-template" id="testProgress.html">
<div class="modal-header">
            <h3 class="modal-title">Run Tests</h3>
</div>
<div class="modal-body">
<table class="table table-condensed" style="width:auto;overflow:scroll">
<tr><th class="col-md-5">Name</th><th class="col-md-10">Result</th></tr>
<tr ng-repeat="test in tests">
	<td>{{test.name}}</td><td>{{test.result | json}}</td>
</tr>
</table>
</div>
<div class="modal-footer">
	<button ng-hide="showclose" class="btn btn-primary" disabled>Please wait ...</button>
	<button ng-show="showclose" class="btn btn-primary" ng-click="close()">Close</button>
</div>
</script>

</body>
</html>
