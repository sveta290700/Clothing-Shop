<?php

namespace App\Console\Commands;

use App\Classes\Parser;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;

class parsing extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'parsing:add';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adding data to tables using site parsing';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $parser = new Parser();
        $categoryController = new CategoryController();
        $categoryController->addParsing($parser->categories);

        $productController = new ProductController();
        $productController->addParsing($parser->products);
        $this->info("The addition is complete!");
    }
}
