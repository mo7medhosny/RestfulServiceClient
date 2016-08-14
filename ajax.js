"use strict";

var urlRoot = 'http://localhost:8080/RestfulService/';

$(function() {
	$("#userForm").submit(getUserData);
});

function getUserData(event) {
	if ($("#userId").val()) {
		$.ajax(urlRoot + 'users/' + $("#userId").val(), {type: 'get', dataType: 'json'}).done(processSuccess)
				.fail(processFail);
	}
	event.preventDefault();
}

function processSuccess(user) {
	$("#mainDiv").empty();
	$('<h1>').text(user.name).appendTo($("#mainDiv"));
	$('<p>').text("Address: " + user.address).appendTo($("#mainDiv"));
	$('<p>').text("Email: " + user.email).appendTo($("#mainDiv"));
	getPosts();
}

function getPosts() {
	var u = $("#userId").val();
	$.ajax(urlRoot + 'users/' + $("#userId").val() + '/posts', {type: 'get', dataType: 'json'}).done(
			processPostsSuccess).fail(processFail);
}

function processPostsSuccess(posts) {
	posts.forEach(function(obj) {
		var div = $('<div id=div-' + obj.id + '>');

		var body = $('<p class=\'post\'>');
		body.text(obj.text);

		var commentDiv = $('<div id=comments-' + obj.id + '>');
		commentDiv.hide();

		var commentShowButton = $('<input class=\'comment\' id=comments-' + obj.id + '-b type=\'button\' value=\'Show Comments\'>');
		commentShowButton.click(displayHideComments(obj.id));
		
		div.append(body).append(commentDiv).append(commentShowButton);
		$("#mainDiv").append(div);
	});
}

function displayHideComments(postId) {
	return function() {
		var div = $('#comments-' + postId);
		if (div.is(":visible")) {
			div.empty();
			div.hide();
			$('#comments-' + postId + '-b').val('Show Comments');
		} else {
			getComments(postId);
		}
	};
}

function getComments(postId) {
	var u = $("#userId").val();
	$.ajax(urlRoot + 'posts/' + postId + '/comments', {type: 'get', dataType: 'json'}).done(
			getProcessCommentsSuccessFun(postId)).fail(processFail);
}

function getProcessCommentsSuccessFun(postId) {
	var myFun = processCommentsSuccess.bind({}, postId);
	return myFun;
}

function processCommentsSuccess(postId, comments) {
	var div = $('#comments-' + postId);
	if (comments)  {
		comments.forEach(function(obj) {
	
			var cDiv = $('<div>');
			
			var userHead = $('<em>');
			userHead.text(obj.user.name);

			var body = $('<p>');
			body.text(obj.text);
			
			cDiv.append(userHead).append(body).append($('<hr>'));
			div.append(cDiv);
		});
	}	
	
	div.show();
	$('#comments-' + postId + '-b').val('Hide Comments');
}

function processFail() {
	alert("Can't fetch the data from server");
}