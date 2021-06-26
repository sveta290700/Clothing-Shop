<?php


namespace App\Classes;

use phpQuery;

require_once(__DIR__.'\..\..\vendor\autoload.php');
class Parser
{
    public $categories = array();
    public $products = array();

    public function __construct(){
        $this->categories = $this->parsingCategories();
        $this->products = $this->parsingProducts();
    }

    protected function parsingCategories(): array
    {
        $html = file_get_contents("https://serovski.ru/catalog/zhenskoe/");
        $dom = phpQuery::newDocument($html);
        $dom = pq(".burger-dropdown-menu")->find("a[href^=/catalog/zhenskoe/]");
        $categories = array();
        foreach($dom as $link){
            $link = pq($link);
            $categories[] = array(
                "text" => $link->attr("title"),
                "url"  => $link->attr("href")
            );
        }
        phpQuery::unloadDocuments();
        unset($categories[0]);
        return $categories;
    }

    protected function parsingProducts(): array
    {
        //получаем ссылки и название товаров из каждого каталога
        $products_link = array();
        foreach ($this->categories as $t){
            $html = file_get_contents("https://serovski.ru".$t["url"]);
            $dom = phpQuery::newDocument($html);
            $dom = pq(".item-title")->find("a");

            foreach($dom as $link){
                $link = pq($link);
                $products_link[] = array(
                    "title" => $link->find("span")->text(),
                    "url"  => $link->attr("href"),
                    "category" => $t["text"]
                );
            }
            phpQuery::unloadDocuments();
        }

        //получаем данные о товарах
        $products = array();
        foreach ($products_link as $product) {
            $html = file_get_contents("https://serovski.ru" . $product["url"]);
            $dom = phpQuery::newDocument($html);

            $image = pq($dom->find("link[rel=image_src]")); //$image->attr("href")
            $price = pq($dom->find("meta[itemprop=lowPrice]"));//$price->attr("content")
            $description = pq($dom->find("div[itemprop=description]"));//$description->text()
            $vendor_code = substr($description->text(), 12, 6);
            $characteristics = pq($dom->find("div[id=obmen_tab]"));//$characteristics->text()

            $products[] = array(
                "name" => $product["title"],
                "description" => $description->text(),
                "price" => (float)$price->attr("content"),
                "category" => $product["category"],
                "image" => $image->attr("href"),
                "vendor_code" => $vendor_code,
                "characteristics" => $characteristics->text()
            );

            phpQuery::unloadDocuments();
        }
        return $products;
    }
}
