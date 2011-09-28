<?php
/**
 * Elenears Erben: Wir tragen das Licht weiter
 *
 * @copyright     Copyright 2011, Elenears Erben (http://elenear.net)
 * @license       http://creativecommons.org/licenses/by-sa/3.0/legalcode Creative Commons Attribution-ShareAlike 3.0
 * @author        Tommi Enenkel
 */

?>

    <h2>Users</h2>

    <ul>
        <?php foreach ($users as $user) { ?>
            <li><?php echo $h($user->username); ?></li>
        <?php } ?>
    </ul>
