#1752890734
cd /www/gogreenorganicclean_264/public
#1752890734
ls -la
#1752890766
cat wp-config.php
#1752890828
cat .htaccess
#1752890879
mv wp-content/plugins wp-content/plugins-disabled
#1752890964
rm wp-content/advanced-cache.php
#1752891179
rm /www/gogreenorganicclean_264/public/wp-content/advanced-cache.php
#1752891305
wp-content/plugins → wp-content/plugins-disabled
#1752891346
mv wp-content/plugins-disabled wp-content/plugins
#1752891612
wp-content/uploads/elementor/
#1752891618
templates → templates-disabled
#1752891632
mv wp-content/uploads/elementor/templates wp-content/uploads/elementor/templates-disabled
#1752892070
SELECT * FROM wp_options WHERE option_value LIKE '%redirect%';
#1752892070
SELECT * FROM wp_posts WHERE post_content LIKE '%redirect%';
#1752892092
wp db query "SELECT * FROM wp_options WHERE option_value LIKE '%redirect%';"
#1752892848
mysql -u gogreenorganicclean -p
#1752892921
rHXzgPjx81wzc1v
#1752892971
mysql -u gogreenorganicclean -p
