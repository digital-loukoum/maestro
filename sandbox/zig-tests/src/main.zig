const std = @import("std");

const toto = struct {
    i: i8,
	// a: bool,
	// b: bool,
	// c: bool,
	// d: bool,
	// e: bool,
};


const PackedStruct = packed struct {
    i1: i32,
    i2: i32,
    i3: i32,
    i4: i32,
    i5: i32,
    i6: i32,
    i7: i32,
    i8: i32,
};

const UnpackedStruct = struct {
    i3: i32,
    i8: i32,
    i2: i32,
    i5: i32,
    i1: i32,
    i4: i32,
    i7: i32,
    i6: i32,
};

const InputStruct = struct {
    i1: i32,
    i2: i32,
    i3: i32,
    i4: i32,
    i5: i32,
    i6: i32,
    i7: i32,
    i8: i32,
};


fn doStuffWithInputStruct(s: *const InputStruct) void {
    _ = s.i1 + s.i8;
}


pub fn main() void {
    const p = PackedStruct {
        .i1 = 1,
        .i2 = 2,
        .i3 = 3,
        .i4 = 4,
        .i5 = 5,
        .i6 = 6,
        .i7 = 7,
        .i8 = 8,
    };
    const u = UnpackedStruct {
        .i1 = 1,
        .i2 = 2,
        .i3 = 3,
        .i4 = 4,
        .i5 = 5,
        .i6 = 6,
        .i7 = 7,
        .i8 = 8,
    };

    {
        const now = std.time.microTimestamp();
        for (0..1000000) |_| {
            doStuffWithInputStruct(@ptrCast( &p));
        }
        std.debug.print("packed: {}\n", .{std.time.microTimestamp() - now});
    }
    
    {
        const now = std.time.microTimestamp();
        for (0..1000000) |_| {
            doStuffWithInputStruct(&.{
                .i1 = u.i1,
                .i2 = u.i2,
                .i3 = u.i3,
                .i4 = u.i4,
                .i5 = u.i5,
                .i6 = u.i6,
                .i7 = u.i7,
                .i8 = u.i8,
            });
        }
        std.debug.print("unpacked: {}\n", .{std.time.microTimestamp() - now});
    }
    
}
