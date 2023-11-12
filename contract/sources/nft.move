/// Example of an unlimited "Sui DriveNFT" collection - anyone can
/// mint their DriveNFT. Shows how to initialize the `Publisher` and how
/// to use it to get the `Display<DriveNFT>` object - a way to describe a
/// type for the ecosystem.
module enn::nft {
    use std::string::{utf8, String, Self};
    use std::vector::{Self};
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};
    use sui::object::{Self, UID};
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};

    // The creator bundle: these two packages often go together.
    use sui::package;
    use sui::display;

    friend enn::issuer;

    /// The DriveNFT - an outstanding collection of digital art.
    struct DriveNFT has key, store {
        id: UID,
        name: String,
        description: String,
        img_url: String,
        created_by: address,
        created_at: u64,
    }

    /// One-Time-Witness for the module.
    struct NFT has drop {}

    /// In the module initializer one claims the `Publisher` object
    /// to then create a `Display`. The `Display` is initialized with
    /// a set of fields (but can be modified later) and published via
    /// the `update_version` call.
    ///
    /// Keys and values are set in the initializer but could also be
    /// set after publishing if a `Publisher` object was created.
    fun init(otw: NFT, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"),
            utf8(b"link"),
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"project_url"),
            utf8(b"creator"),
        ];

        let values = vector[
            // For `name` one can use the `DriveNFT.name` property
            utf8(b"{name}"),
            utf8(b""),
            utf8(b"{img_url}"),
            // Description is static for all `DriveNFT` objects.
            utf8(b"{description}"),
            // Project URL is usually static
            utf8(b"https://poap.umilabs.org"),
            // Creator field can be any
            utf8(b"Mazda Drive NFT")
        ];

        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `DriveNFT` type.
        let display = display::new_with_fields<DriveNFT>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    public(friend) fun new(
        name: String,
        description: String,
        img_url: String,
        clock: &Clock,
        ctx: &mut TxContext,
    ): DriveNFT {
        DriveNFT {
            id: object::new(ctx),
            name,
            description,
            img_url,
            created_by: tx_context::sender(ctx),
            created_at: clock::timestamp_ms(clock),
        }
    }

    public(friend) fun uid_mut_as_owner(
        self: &mut DriveNFT
    ): &mut UID {
        &mut self.id
    }

}