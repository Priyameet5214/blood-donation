// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DonationRecords {
    struct Donation {
        uint256 donorId;
        string date;
        string bloodUnitId;
    }

    Donation[] public donations;

    event DonationAdded(uint256 donorId, string date, string bloodUnitId);

    function addDonation(uint256 _donorId, string calldata _date, string calldata _bloodUnitId) external {
        donations.push(Donation(_donorId, _date, _bloodUnitId));
        emit DonationAdded(_donorId, _date, _bloodUnitId);
    }

    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }
}