module enn::issuer {
    use std::string::{utf8, String, Self};
    use std::vector::{Self};
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};
    use sui::object::{Self, UID};
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};

    use enn::nft::{Self};

    fun init(ctx: &mut TxContext) {
    }

    public entry fun mint(
        clock: &Clock,
        event_key: String,
        name: String,
        description: String,
        img_url: String,
        ctx: &mut TxContext,
    ) {
        let nft = nft::new(name, description, img_url, clock, ctx);
        transfer::public_share_object(nft);
    }

}