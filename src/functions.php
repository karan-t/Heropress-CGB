<?php
function heropress_widget_render_block($attr, $content){
    $singleFeedItem = '<div class="alignfull"><div class="feed_content"><h3 class="essay_maintitle">'.$attr['essayMainTitle'].'</h3><div style="display: grid; grid-template-rows: auto;grid-template-columns: repeat('.$attr['essayColumns'].',auto);gap: 20px;">';
    $count = 1;
    $essaysperpage = $attr['essayPerPage'];
        foreach($attr['heropressData'] as $key => $value){
            if($count <= $essaysperpage){
            $singleFeedItem .= '<a class="essay_link" href='.$value["link"].'><div class="essay_holder">';
            !empty($attr["showTitle"]) ? $singleFeedItem .= '<h3 class="essay_title">'.$value["title"].'</h3>' : null;
            !empty($attr["showImage"]) ? $singleFeedItem .= '<img class="essay_img" src='.$value["enclosure"].' />' : null;
            !empty($attr["showAuthor"]) ? $singleFeedItem .= '<p class="essay_creator">'.$value["creator"].'</p>' : null;
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