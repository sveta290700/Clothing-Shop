<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'fio' => 'required|max:255',
            'phone_number' => 'required|max:20',
            'email' => 'required|max:100|email',
            'address' => 'required',
            'cost' => 'required|numeric',
            'comments' => 'nullable'
        ];
    }
}
