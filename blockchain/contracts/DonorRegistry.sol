// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DonorRegistry {
    struct Donor {
        string name;
        string bloodType;
    }

    Donor[] public donors;

    event DonorRegistered(string name, string bloodType);

    function registerDonor(string calldata _name, string calldata _bloodType) external {
        donors.push(Donor(_name, _bloodType));
        emit DonorRegistered(_name, _bloodType);
    }

    function getAllDonors() external view returns (Donor[] memory) {
        return donors;
    }
}