<?php

add_action("wp_ajax_heropress_get_feed", "heropress_get_feed");
add_action("wp_ajax_nopriv_heropress_get_feed", "heropress_get_feed");


function heropress_get_feed(){
    $rss = fetch_feed("https://heropress.com/essays/feed/");
    $rss_items = (array)$rss->get_items(0, 10);
    $feed_obj = array();
    foreach ( $rss_items as $item ) {
        $item_array = array();
        
        $author = $item->get_authors();
        $item_array['author_name'] = $author[0]->name;

        $enclosure = $item->get_enclosure();
        $item_array['enclosure_url'] = esc_url( $enclosure->get_link() );

        $title = esc_html( $item->get_title() );
        $item_array['title'] = $title;

        $permalink = esc_url( $item->get_permalink() );
        $item_array['permalink'] = $permalink;

        $pub_date = $item->get_date( 'j F Y' );
        $item_array['pub_date'] = $pub_date;

        array_push($feed_obj, $item_array);
    }
    echo json_encode($feed_obj, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}


function heropress_widget_render_block($attr, $content){
    $singleFeedItem = '<div class="alignfull"><div class="feed_content"><h3 class="essay_maintitle">'.$attr['essayMainTitle'].'</h3><div style="display: grid; grid-template-rows: auto;grid-template-columns: repeat('.$attr['essayColumns'].',auto);gap: 20px;">';
    $count = 1;
    $essaysperpage = $attr['essayPerPage'];
        foreach($attr['heropressData'] as $key => $value){
            if($count <= $essaysperpage){
            $singleFeedItem .= '<a class="essay_link" href='.$value["link"].'><div class="essay_holder">';
            !empty($attr["showTitle"]) ? $singleFeedItem .= '<h3 class="essay_title">'.$value["title"].'</h3>' : null;
            !empty($attr["showImage"]) ? $singleFeedItem .= '<img class="essay_img" src='.$value["enclosure_url"].' />' : null;
            !empty($attr["showAuthor"]) ? $singleFeedItem .= '<p class="essay_creator">'.$value["author_name"].'</p>' : null;
            !empty($attr["showPublishDate"]) ?  $singleFeedItem .= '<p class="essay_pubdate">Posted '.date("d F Y",strtotime($value["pubDate"])).'</p>' : null;             
            $singleFeedItem .= '</div></a>';
            $count++;
            }
            else{
                break;
            }
        }
        $singleFeedItem .= '</div></div></div>';
    return $singleFeedItem;
}

