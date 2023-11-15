module enn::issuer {
    use std::string::{utf8, String, Self};
    use std::vector::{Self};
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};
    use sui::object::{Self, UID, ID};
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use sui::bag::{Self, Bag};

    use enn::nft::{Self, DriveNFT};

    struct DriveNFTIndex has key, store {
        id: UID,
        // table: Table<address, ID>,
        // bag: Bag,
        nft: ID,
    }

    fun count_key(): String {
        string::utf8(b"liked_count")
    }

    fun liked_key(): String {
        string::utf8(b"liked_by")
    }

    fun init(ctx: &mut TxContext) {
        // let index = DriveNFTIndex {
        //     id: object::new(ctx),
        //     table: table::new<address, ID>(ctx),
        //     bag: bag::new(ctx)
        // };
        // transfer::share_object(index);
    }

    public entry fun mint(
        // index: &mut DriveNFTIndex,
        clock: &Clock,
        name: String,
        description: String,
        img_url: String,
        ctx: &mut TxContext,
    ) {
        let nft = nft::new(name, description, img_url, clock, ctx);
        df::add(nft::uid_mut_as_owner(&mut nft), count_key(), 0);
        df::add(nft::uid_mut_as_owner(&mut nft), liked_key(), vector::empty<address>());
        // df::add(nft::uid_mut_as_owner(&mut nft), liked_key(), vec_set::empty<address>());
        // table::add(&mut index.table, tx_context::sender(ctx), object::id(&nft));
        // bag::add(&mut index.bag, tx_context::sender(ctx), object::id(&nft));
        let index = DriveNFTIndex {
            id: object::new(ctx),
            nft: object::id(&nft)
        };
        transfer::public_share_object(nft);
        transfer::public_transfer(index, tx_context::sender(ctx));
    }

    public entry fun like(
        nft: &mut DriveNFT,
        ctx: &mut TxContext
    ){
        let count: &mut u64 = df::borrow_mut(nft::uid_mut_as_owner(nft), count_key());
        *count = *count + 1;
        let liked_set: &mut vector<address> = df::borrow_mut(nft::uid_mut_as_owner(nft), liked_key());
        // let liked_set: &mut VecSet<address> = df::borrow_mut(nft::uid_mut_as_owner(nft), liked_key());
        vector::push_back(liked_set, tx_context::sender(ctx));
        // vec_set::insert(liked_set, tx_context::sender(ctx));
    }

}