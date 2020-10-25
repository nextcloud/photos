$('#photos_dir').on('click', function () {
	OC.dialogs.filepicker(
		t('photos', 'Select a folder to use in Photo app'),
		function (path) {
			$('#photos_dir').val(path);

			$.ajax({
				url: OC.generateUrl('apps/photos/api/v1/config/photos_dir'),
				type: 'PUT',
				data: {value: path},
				success: function(data) {OC.Notification.showTemporary(t('photos', 'saved')); },
				error: function(data) {OC.Notification.showTemporary(t('photos', 'Error saving setting')); },
			});
		},
		false,
		'httpd/unix-directory',
		true
	);
});
