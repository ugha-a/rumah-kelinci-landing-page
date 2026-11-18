<?php

use Inertia\Testing\AssertableInertia as Assert;

it('renders the landing page through Inertia', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertSee('Rumah Kelinci Padel: 4 lapangan padel', false)
        ->assertInertia(fn (Assert $page) => $page->component('welcome'));
});
