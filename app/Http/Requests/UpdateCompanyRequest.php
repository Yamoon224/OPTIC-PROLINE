<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'register_id' => ['nullable', 'string', 'max:255', 'unique:companies,register_id,' . $this->company->id], // Nouvelle règle
            'address' => ['sometimes', 'required', 'string', 'max:255'],                                     // Nouvelle règle
            'contact' => ['sometimes', 'required', 'string', 'max:255'],                                     // Nouvelle règle
        ];
    }
}