<?php
/**
 * WordPress 评论导出为 Artrans (Artalk) 格式
 *
 * 用法:
 *   1. 上传此文件到 WordPress 根目录（和 wp-load.php 同级）
 *   2. 浏览器访问 https://blog.30hb.cn/wp-export-artrans.php
 *   3. 保存输出的 JSON 为 comments.artrans 文件
 *   4. 在 Artalk 后台「迁移」中导入该文件
 *
 *   或 SSH 到服务器:
 *   php wp-export-artrans.php > comments.artrans
 *
 * 使用后请立即删除此文件！
 */

require_once __DIR__ . '/wp-load.php';

// 旧 WordPress ID → 新 slug 的映射
$slug_map = [
    37  => 'common-commands',
    44  => 'important-notice',
    46  => 'some-help',
    143 => 'deploy-30hb-server',
    174 => 'setup-30hb-local',
    207 => 'mongodb-import-export',
    228 => 'boom-beach-changelog',
    255 => 'change-client-ip-sha',
    287 => 'setup-boom-beach',
    301 => 'shanghai-travel-diary',
    349 => '/donate/',
    412 => 'supercell-texture-extractor',
    454 => 'hb-boom-beach-changelog',
    501 => 'setup-clash-royale',
    542 => 'setup-clash-of-clans',
    559 => 'setup-brawl-stars',
    598 => 'emeditor-csv',
    607 => 'supercell-animation',
    754 => 'multi-sc-server',
];

$site_name = '蚕豆私服';
$site_url  = 'https://30hb.cn';

global $wpdb;

$comments = $wpdb->get_results("
    SELECT
        c.comment_ID,
        c.comment_post_ID,
        c.comment_parent,
        c.comment_author,
        c.comment_author_email,
        c.comment_author_url,
        c.comment_author_IP,
        c.comment_agent,
        c.comment_date,
        c.comment_content,
        c.comment_approved,
        c.comment_type,
        p.post_title
    FROM {$wpdb->comments} c
    LEFT JOIN {$wpdb->posts} p ON c.comment_post_ID = p.ID
    WHERE c.comment_type IN ('comment', '')
    AND c.comment_approved = '1'
    ORDER BY c.comment_date ASC
");

$artrans = [];
// 旧 comment_ID → 新顺序 ID 的映射（保持父子关系）
$id_map = [];
$counter = 1;

foreach ($comments as $c) {
    $post_id = (int) $c->comment_post_ID;

    // 计算 page_key
    if (isset($slug_map[$post_id])) {
        $slug = $slug_map[$post_id];
        // 349 (捐赠) 已经是完整路径
        $page_key = ($slug === '/donate/') ? '/donate/' : "/blog/{$slug}/";
    } else {
        // 未在映射中的文章，用原始 WordPress 路径
        $page_key = "/{$post_id}/";
    }

    $old_id = (int) $c->comment_ID;
    $new_id = (string) $counter++;
    $id_map[$old_id] = $new_id;

    // 父评论 ID 映射
    $rid = '0';
    $parent = (int) $c->comment_parent;
    if ($parent > 0 && isset($id_map[$parent])) {
        $rid = $id_map[$parent];
    }

    $artran = [
        'id'              => $new_id,
        'rid'             => $rid,
        'content'         => $c->comment_content,
        'ua'              => $c->comment_agent ?: '',
        'ip'              => $c->comment_author_IP ?: '',
        'created_at'      => $c->comment_date,
        'updated_at'      => $c->comment_date,
        'is_collapsed'    => 'false',
        'is_pending'      => 'false',
        'vote_up'         => '0',
        'vote_down'       => '0',
        'nick'            => $c->comment_author,
        'email'           => $c->comment_author_email,
        'link'            => $c->comment_author_url ?: '',
        'password'        => '',
        'badge_name'      => '',
        'badge_color'     => '',
        'page_key'        => $page_key,
        'page_title'      => $c->post_title ?: '',
        'page_admin_only' => 'false',
        'site_name'       => $site_name,
        'site_urls'       => $site_url,
    ];

    $artrans[] = $artran;
}

header('Content-Type: application/json; charset=utf-8');
header('Content-Disposition: attachment; filename="comments.artrans"');
echo json_encode($artrans, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
