<?php

script('photos', 'settings');

?>
<div class="section">
	<h2><?php p($l->t('Photos')); ?></h2>
	<?php p($l->t('Directory for use in Photo app')); ?>: <input type="text" id="photos_dir" value="<?php p($_['photos_dir']); ?>" />
</div>
